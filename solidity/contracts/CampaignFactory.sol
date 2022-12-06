// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./Campaign.sol";

/// @title Campaign Factory contract that is used to deploy every Campaign contract.
contract CampaignFactory {
    address[] public campaigns;
    address public crowdCreator;

    /// @notice Instantiate a CampaignFactory.
    constructor() {
        crowdCreator = msg.sender;
    }

    /** @notice Deploy a Campaign.
        @param minimumContribution The minimum contribution a person can add to a Campaign.
        @param openDays The number of days the Campaign will be open to new contributors.
     */
    function deployCampaign(uint256 minimumContribution, uint256 openDays)
        external
    {
        Campaign newCampaign = new Campaign(
            minimumContribution,
            openDays,
            msg.sender,
            crowdCreator
        );
        campaigns.push(address(newCampaign));
    }
}
