// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./Campaign.sol";

contract CampaignFactory {
    address[] public campaigns;
    address public crowdCreator;

    constructor() {
        crowdCreator = msg.sender;
    }

    function deployCampaign(uint256 minimumContribution, uint256 openDays)
        public
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
