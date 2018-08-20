/**
 * @author Sushant Kumar <sshnt.kmr3@gmail.com>
 * @title CrowdCoin
 * @section DESCRIPTION
 * This smart contract is an implementation of Kickstarter using Solidity.
 * It is used to create Campaigns to raise funds and then request the backers of 
 * the Campagin to approve the usage of the raised funds for various purposes.
 * Additional features include withdrawal before deadline, refund initiated by Campaign manager 
 * and rating of campaigns.
 * 
 */

pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";

contract CampaignFactory is Ownable, Pausable {

    using SafeMath for uint256;

    event NewCampaign(address campaignAddress, string name, uint minimum, address creator, uint deadline, uint goal, string details);

    struct CampaignStatus {
        address addrOfCampaign;
        uint deadline;
    }

    mapping(address => CampaignStatus[]) public campaignCreatorsList;
    mapping(address => CampaignStatus[]) public backersList;
    CampaignStatus[] public deployedCampaigns;

    /**
    * @dev Create a new Campaign with the required parameters
    * @param name Name of the campaign
    * @param minimum Minimum contribution for the campaign
    * @param _deadline Deadline for the campaign
    * @param _goal Funding goal of the campaign
    * @param details Additional details for the campaign
    */
    function createCampaign(string name, uint minimum, uint _deadline, uint _goal, string details) public whenNotPaused {
        address newCampaign = new Campaign(name, minimum, msg.sender, _deadline, _goal, details);
        CampaignStatus memory newAddition = CampaignStatus({addrOfCampaign: newCampaign, deadline: _deadline });
        deployedCampaigns.push(newAddition);
        emit NewCampaign(newCampaign, name, minimum, msg.sender, _deadline, _goal, details);
    }

    /**
    * @dev To retrieve list of campaigns. Uses filterCampaigns() to filter
    * @param user Address of the user
    * @param code If 0 -> shows a general list.  1 -> Filters through campaign creators list.  2 -> Filters through campaign backers list  
    * @return List of addresses of Ongoing and Completed Campaigns
    */
    function getCampaigns(address user, uint code) public view returns(address[] ongoingCampaigns, address[] completedCampaigns) {
        CampaignStatus[] memory listOfCampaigns;

        if(code == 0) {
            listOfCampaigns = deployedCampaigns;
        }

        else if(code == 1) {
            listOfCampaigns = campaignCreatorsList[user];
        }

        else if(code == 2) {
            listOfCampaigns = backersList[user];
        }

        return(filterCampaigns(listOfCampaigns));
    }

    /**
    * @dev Filters campaigns based on current block.timestamp into ongoing and completed
    * @param campaigns List of CampaignStatus from getCampaigns() to filtered upon
    * @return List of addresses of Ongoing and Completed Campaigns
    */
    function filterCampaigns(CampaignStatus[] campaigns) internal view returns(address[] ongoingCampaigns, address[] completedCampaigns) {
        uint indexOfOngoing;
        uint indexOfCompleted;

        uint numberOfCampaigns = campaigns.length;
        ongoingCampaigns = new address[](numberOfCampaigns);
        completedCampaigns = new address[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i = i.add(1)) {
            CampaignStatus memory campaign = campaigns[i];

            // Ongoing Campaigns
            if(block.timestamp <= campaign.deadline ) {
                ongoingCampaigns[indexOfOngoing] = campaign.addrOfCampaign;
                indexOfOngoing = indexOfOngoing.add(1);
            }

            // Completed Campaigns
            else {
                completedCampaigns[indexOfCompleted] = campaign.addrOfCampaign;
                indexOfCompleted = indexOfCompleted.add(1);
            }
        }
        return (ongoingCampaigns, completedCampaigns);
    }

    /**
    * @dev Adds user to the lists campaignCreatorsList and backersList for all campaigns created
    * @param user Address of user to be added to campaignCreatorsList/backersList
    * @param creatorOrBacker flag for a campaign creator/backer
    * @param _deadline Deadline of campaign acts as an additional parameter to filter for user profiles
    * @return List of addresses of Ongoing and Completed Campaigns
    */
    function addToList(address user, uint creatorOrBacker, uint _deadline) public {
        CampaignStatus memory newAddition = CampaignStatus({addrOfCampaign: msg.sender, deadline: _deadline});
        bool notPresent = true;

        if(creatorOrBacker == 1) {
            CampaignStatus[] storage creatorCampaigns = campaignCreatorsList[user];

            for(uint i = 0; i < creatorCampaigns.length; i++) {
                CampaignStatus memory campaignC = creatorCampaigns[i];
                if(newAddition.addrOfCampaign == campaignC.addrOfCampaign) {
                    notPresent = false;
                }
            }

            if(notPresent == true) {
                creatorCampaigns.push(newAddition);
                campaignCreatorsList[user] = creatorCampaigns;                
            }
        }

        else if(creatorOrBacker == 2) {
            CampaignStatus[] storage backerCampaigns = backersList[user];

            for(uint j = 0; j < backerCampaigns.length; j++) {
                CampaignStatus memory campaignB = backerCampaigns[j];
                if(newAddition.addrOfCampaign == campaignB.addrOfCampaign) {
                    notPresent = false;
                }
            }

            if(notPresent == true) {
                backerCampaigns.push(newAddition);
                backersList[user] = backerCampaigns;
            }
        }
    }

    /**
    * @dev Deletes users from the lists backersList if a user withdrew their funds
    * @param Address of the user
    */
    function deleteFromList(address user) public {
        CampaignStatus[] storage listOfCampaigns = backersList[user];

        for(uint index = 0; index < listOfCampaigns.length; index = index.add(1)) {
            CampaignStatus memory campaign = listOfCampaigns[index];

            if(msg.sender == campaign.addrOfCampaign) {
                delete listOfCampaigns[index];
            }
        }
        backersList[user] = listOfCampaigns;
    }
}


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
    * @dev Modifier to check if deadline has passed and the campaign has raised more than its goal
    */
    modifier postDeadline() {
        require(block.timestamp > deadline && amountRaised > goal);
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
    function contribute() public payable whenNotPaused {
        require(msg.value > minimumContribution && block.timestamp <= deadline);

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
    function withdraw() public validBacker nonReentrant {
        require(block.timestamp <= deadline || amountRaised < goal || refundFlag);
        uint amountWithdrawn  = backers[msg.sender];

        if(refundFlag) {
            amountWithdrawn = amountWithdrawn.div(amountRaised).mul(amountRemaining);
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
        Request storage request = requests[index];
        require(request.backerCount > (backersCount.div(2)));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        amountRemaining = amountRemaining.sub(request.value);
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
    * @return
    */
    function getSummary() public view returns(string, address, uint, uint, uint, string, uint, uint, uint, uint, uint, uint) {
        return(nameOfCampaign, manager, minimumContribution, deadline, goal, details, amountRaised, address(this).balance, backers[msg.sender], requests.length, rating, backersCount);
    }

    /**
    * @dev Retrieve status of the Campaign
    * @return
    */
    function getCampaignStatus() public view returns(bool, bool) {
        return(paused, refundFlag);
    }

    /**
    * @dev Retrieve the number of Requests in the Campaign
    * @return
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
    }

    /**
    * @dev Compute rating of the campaign after deadline
    * @return
    */
    function computeRating() public onlyOwner postDeadline returns (uint) {
        rating = ratingSum.div(ratersCount);
        return rating;
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
