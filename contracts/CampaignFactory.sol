/**
 * @author Sushant Kumar
 * @title CampaignFactory
 * @section DESCRIPTION
 * This smart contract is an implementation of Kickstarter using Solidity.
 * It is used to create Campaigns to raise funds and then request the backers of 
 * the Campagin to approve the usage of the raised funds for various purposes.
 * Additional features include withdrawal before deadline, refund initiated by Campaign manager 
 * and rating of campaigns.
 * Follows a Factory design pattern wherein the CampaignFactory creates instances of the Campaign
 */

pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./Pausable.sol";
import "./Campaign.sol";

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
    * @param user address of the user
    * @param code If 0 -> shows a general list.  1 -> Filters through campaign creators list.  2 -> Filters through campaign backers list  
    * @return ongoingCampaigns List of addresses of Ongoing Campaigns
    * @return completedCampaigns List of addresses of Completed Campaigns
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
    * @return ongoingCampaigns List of addresses of Ongoing Campaigns
    * @return completedCampaigns List of addresses of Completed Campaigns
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
    * @param user address of user to be added to campaignCreatorsList/backersList
    * @param creatorOrBacker flag for a campaign creator/backer
    * @param _deadline Deadline of campaign acts as an additional parameter to filter for user profiles
    */
    function addToList(address user, uint creatorOrBacker, uint _deadline) public {
        CampaignStatus memory newAddition = CampaignStatus({addrOfCampaign: msg.sender, deadline: _deadline});
        bool notPresent = true;

        if(creatorOrBacker == 1) {
            CampaignStatus[] storage creatorCampaigns = campaignCreatorsList[user];

            for(uint i = 0; i < creatorCampaigns.length; i++) {
                CampaignStatus memory tempCampaign = creatorCampaigns[i];
                if(newAddition.addrOfCampaign == tempCampaign.addrOfCampaign) {
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
                CampaignStatus memory tempoCampaign = backerCampaigns[j];
                if(newAddition.addrOfCampaign == tempoCampaign.addrOfCampaign) {
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
    * @dev Deletes users from the list backersList if a user withdrew their funds
    * @param user address of the user
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
