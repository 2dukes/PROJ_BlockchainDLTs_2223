// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Campaign.sol";

/// @title Campaign Factory contract that is used to deploy every Campaign contract.
contract CampaignFactory {
    /// @notice Array containing all the deployed campaigns.
    address[] public campaigns;

    /// @notice Crowdfunding platform creator.
    address public crowdCreator;

    /// @notice Address of the deployed NFT contract.
    address public crowdNFTContractAddr;

    /// @notice Signals the creation of a new campaign.
    event NewCampaignDeployed(address campaignAddr);

    /// @notice Instantiate a CampaignFactory.
    constructor() {
        crowdCreator = msg.sender;
        crowdNFTContractAddr = address(new CrowdNFT());
    }

    /** @notice Deploy a Campaign.
        @param minimumContribution The minimum contribution a person can add to a Campaign.
        @param maximumNFTContributors number of campaign contributers that will get an NFT bonus.
        @param openDays The number of days the Campaign will be open to new contributors.
     */
    function deployCampaign(
        uint256 minimumContribution,
        uint256 targetValue,
        uint8 maximumNFTContributors,
        uint256 openDays
    ) external {
        Campaign newCampaign = new Campaign(
            minimumContribution,
            targetValue,
            maximumNFTContributors,
            openDays,
            msg.sender,
            crowdCreator,
            crowdNFTContractAddr
        );

        address newCampaignAddr = address(newCampaign);
        campaigns.push(newCampaignAddr);
        emit NewCampaignDeployed(newCampaignAddr);
    }

    /** @notice Get all deployed campaigns.
        @return campaigns Array containing address of all the deployed campaigns.
     */
    function getCampaigns() public view returns (address[] campaigns) {
        return campaigns;
    }
}
