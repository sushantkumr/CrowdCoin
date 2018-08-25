/**
 * @title Campaign
 * @section DESCRIPTION
 * Campaign contract created for every new campaign, by invoking the createCampaign(args..)
 * in CampaignFactory. Caller of createCamapign will be the manager of the Campign instance.
 */

pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "./CampaignFactory.sol";

contract Campaign is Ownable, ReentrancyGuard, Pausable {

    using SafeMath for uint256;
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint backerCount;
        mapping(address => bool) backers;
    }
    
    Request[] public requests;
    address public manager;
    string public nameOfCampaign;
    string public details;
    uint public minimumContribution;
    uint public deadline;
    uint public goal;
    uint public backersCount;
    uint public ratersCount;
    uint public ratingSum;
    uint public rating;
    bool public refundFlag;
    uint public amountRaised;
    uint public requestedAmount;
    uint public amountRemaining;
    address public factoryAddress;

    // Limiting contributions to 10 ETH
    uint constant MAX_LIMIT_FOR_CONTRIB = 10000000000000000000;

    CampaignFactory factory;

    mapping(address => uint256) public backers;
    mapping(address => uint256) private ratingFrombackers;


    event Contribute(address contributor, uint amount);
    event Withdrawal(address contributor, uint amount);
    event RequestFinalized(address recipient, uint value);

    /**
    * @dev Modifier to check if the backer has contributed
    */
    modifier validBacker() {
        require(backers[msg.sender] > 0);
        _;
    }

    /**
    * @dev Modifier to check if deadline has passed and the campaign has reached its goal
    */
    modifier postDeadline() {
        require(block.timestamp > deadline && amountRaised >= goal);
        _;
    }

    /**
    * @dev Constructor to create a Campaign
    */
    constructor(string _name, uint _minimumContribution, address creator, uint _deadline, uint _goal, string _details) public {

        require(block.timestamp < _deadline);
        nameOfCampaign = _name;
        manager = creator;
        minimumContribution = _minimumContribution;
        deadline = _deadline;
        goal = _goal;
        details = _details;
        refundFlag = false;
        factoryAddress = msg.sender;
        factory = CampaignFactory(factoryAddress);

        factory.addToList(creator, 1, deadline);
        // Otherwise the owner of the Campaign instance will always be the CampaignFactory
        transferOwnership(creator);
    }
    
    /**
    * @dev Payable function recieve funds from backers
    */
    function contribute() public payable whenNotPaused nonReentrant {
        require(msg.value >= minimumContribution && block.timestamp <= deadline);
        uint checkAmount = amountRaised.add(msg.value);

        if(checkAmount > MAX_LIMIT_FOR_CONTRIB) {
            revert();
        }

        if(backers[msg.sender] == 0) {
            backersCount = backersCount.add(1);            
        }

        backers[msg.sender] = backers[msg.sender].add(msg.value);
        amountRaised = amountRaised.add(msg.value);
        amountRemaining = amountRemaining.add(msg.value);
        factory.addToList(msg.sender, 2, deadline);
        emit Contribute(msg.sender, msg.value);
    }

    /**
    * @dev Function to withdraw funds from the campaign
    */
    function withdraw() external validBacker nonReentrant {
        require(block.timestamp <= deadline || amountRaised < goal || refundFlag);
        uint amountWithdrawn = backers[msg.sender];
        backers[msg.sender] = 0;

        if(refundFlag) {
            amountWithdrawn = amountWithdrawn.mul(amountRemaining).div(amountRaised);
        }

        else {
            amountRaised = amountRaised.sub(amountWithdrawn);
            amountRemaining = amountRemaining.sub(amountWithdrawn);
            backersCount = backersCount.sub(1);
            factory.deleteFromList(msg.sender);
        }

        msg.sender.transfer(amountWithdrawn);
        emit Withdrawal(msg.sender, amountWithdrawn);
    }

    /**
    * @dev Create a request to utilize the funds raised
    * @param description Description of the Request
    * @param value Value in wei for the particular request
    * @param recipient Recipient address of the request
    */    
    function createRequest(string description, uint value, address recipient) public onlyOwner postDeadline whenNotPaused{
        require(!refundFlag);
        requestedAmount = requestedAmount.add(value);
        if(requestedAmount > amountRemaining) {
            revert();
        }

        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            backerCount:  0
        });
        
        requests.push(newRequest);
    }

    /**
    * @dev Backers of the campaign can approve the request
    * @param index Index of the request for approval
    */    
    function approveRequest(uint index) public validBacker {
        Request storage request = requests[index];
        require(!request.backers[msg.sender]);

        request.backers[msg.sender] = true;
        request.backerCount = request.backerCount.add(1);
    }

    /**
    * @dev Finalizing the request for funds if more than 50% of the backers approve
    * @param index Index of the request for approval
    */    
    function finalizeRequest(uint index) public onlyOwner {
        require(!refundFlag);
        Request storage request = requests[index];
        require(request.backerCount > (backersCount.div(2)));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        amountRemaining = amountRemaining.sub(request.value);
        requestedAmount = requestedAmount.sub(request.value);
        request.complete = true;
        emit RequestFinalized(request.recipient, request.value);
    }

    /**
    * @dev Owner can activate the refund flag
    */
    function refundBackerFunds() public onlyOwner postDeadline {
        refundFlag = true;
    }

    /**
    * @dev Retrieve summary of the Campaign
    * @return Multiple parameters of the Campaign
    */
    function getSummary() public view returns(string, address, uint, uint, uint, string, uint, uint, uint, uint, uint) {
        return(nameOfCampaign, manager, minimumContribution, deadline, goal, details, amountRaised, address(this).balance, requests.length, rating, backersCount);
    }

    /**
    * @dev Retrieve status of the Campaign
    * @return bool If contract is paused or not
    * @return bool If refundFlag has been activated or not
    */
    function getCampaignStatus() public view returns(bool, bool) {
        return(paused, refundFlag);
    }

    /**
    * @dev Retrieve the number of Requests in the Campaign
    * @return uint The number of requests
    */
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    /**
    * @dev Store rating from a valid backer of the campaign
    * @param _rating Rating ranges from 1 - 5
    */
    function giveRating(uint _rating) public validBacker postDeadline {
        require(ratingFrombackers[msg.sender] == 0);
        ratingFrombackers[msg.sender] = _rating;
        ratersCount = ratersCount.add(1);
        ratingSum = ratingSum.add(_rating);
        rating = ratingSum.div(ratersCount);
    }

    /**
    * @dev payable fallback
    */
    function () public payable {
        if (!msg.sender.send(msg.value)) {
            revert();
        }
    }
}
