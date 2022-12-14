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
    function deployCampaign(uint minimumContribution, uint targetValue, uint8 maximumNFTContributors, uint openDays)
        external
    {
        Campaign newCampaign = new Campaign(
            minimumContribution,
            targetValue,
            maximumNFTContributors,
            openDays,
            msg.sender,
            crowdCreator,
            crowdNFTContractAddr
        );
        campaigns.push(address(newCampaign));
    }
}
