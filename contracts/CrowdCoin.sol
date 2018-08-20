// funding all-or-nothing

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
    
    function createCampaign(string name, uint minimum, uint _deadline, uint _goal, string details) public whenNotPaused {
        address newCampaign = new Campaign(name, minimum, msg.sender, _deadline, _goal, details);
        CampaignStatus memory newAddition = CampaignStatus({addrOfCampaign: newCampaign, deadline: _deadline });
        deployedCampaigns.push(newAddition);
        emit NewCampaign(newCampaign, name, minimum, msg.sender, _deadline, _goal, details);
    }

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

    modifier validBacker() {
        require(backers[msg.sender] > 0);
        _;
    }
    
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
    
    function createRequest(string description, uint value, address recipient) public onlyOwner whenNotPaused{
        require(block.timestamp > deadline && amountRaised > goal);

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
    
    function approveRequest(uint index) public validBacker {
        Request storage request = requests[index];
        
        require(!request.backers[msg.sender]);
        
        request.backers[msg.sender] = true;
        request.backerCount = request.backerCount.add(1);
    }
    
    function finalizeRequest(uint index) public onlyOwner {
        Request storage request = requests[index];
        require(request.backerCount > (backersCount.div(2)));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        amountRemaining = amountRemaining.sub(request.value);
        request.complete = true;
        emit RequestFinalized(request.recipient, request.value);
    }

    // If few requests have been processed the %age of contribution will be returned
    function refundBackerFunds() public onlyOwner {
        require(block.timestamp > deadline);
        refundFlag = true;
    }

    function getSummary() public view returns(string, address, uint, uint, uint, string, uint, uint, uint, uint, uint, uint) {
        return(nameOfCampaign, manager, minimumContribution, deadline, goal, details, amountRaised, address(this).balance, backers[msg.sender], requests.length, rating, backersCount);
    }

    function getCampaignStatus() public view returns(bool, bool) {
        return(paused, refundFlag);
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    // Rating
    function giveRating(uint _rating) public validBacker {
        require(block.timestamp > deadline && amountRaised > goal);
        require(ratingFrombackers[msg.sender] == 0);
        ratingFrombackers[msg.sender] = _rating;
        ratersCount = ratersCount.add(1);
        ratingSum = ratingSum.add(_rating);
    }

    function computeRating() public onlyOwner returns (uint) {
        require(block.timestamp > deadline);
        rating = ratingSum.div(ratersCount);
        return rating;
    }

    // Send any ether received back to the sender
    function () public payable {
        if (!msg.sender.send(msg.value)) {
            revert();
        }
    }
}
