// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./CrowdNFT.sol";

/// @title Campaign contract that includes all the necessary logic to run a campaign.
contract Campaign {
    /// @notice Denotes the state of a request.
    enum RequestState {
        PENDING,
        APPROVED
    }

    /// @notice Data structure responsible for a request to invest campaign funds.
    struct Request {
        uint256 id; // Stored externally as a mapping to a Request description.
        uint256 value;
        bool complete;
        mapping(address => RequestState) approvals;
        uint256 approvalValue;
        uint256 openDate;
    }

    /// @notice Array of campaign requests.
    Request[] public requests;

    /// @notice The campaign creator.
    address payable public campaignCreator;

    /// @notice The allowed contribution a person can add to a Campaign.
    uint256 public minimumContribution;

    /// @notice Number of campaign contributers that will get an NFT bonus.
    uint8 public maximumNFTContributors;

    /// @notice Total amount the campaign raised.
    uint256 public raisedValue;

    /// @notice The target amount the campaign wants to raise.
    uint256 public targetValue;

    /** @notice List of contributors and invested amount. 
        @dev Invested amount comes in Wei.
    */
    mapping(address => uint256) public approvers;

    /// @notice A counter of the total contributors.
    uint256 public approversCount;

    /** @notice Holds the end date of the contract.
        @dev Block.timestamp + OpenDays (in seconds).
    */
    uint256 public endDate;

    /** @notice Crowdfunding platform creator.
        @dev CampaignFactory contract creator.
    */
    address payable private crowdCreator;

    /// @notice Address of the deployed NFT contract.
    address public crowdNFTContractAddr;

    /// @notice Error related to invocation only allowed by the campaign creator.
    error OnlyCampaignOwner();

    /// @notice Error related to invocation only allowed by the crowdfunding platform creator.
    error OnlyCrowdOwner();

    /// @notice Error related to the fact that a request was already completed.
    error RequestNotCompleted();

    /// @notice Modifier that restricts invocation to campaign creator.
    modifier onlyCampaignOwner() {
        if (msg.sender != campaignCreator) revert OnlyCampaignOwner();
        _;
    }

    /// @notice Modifier that restricts invocation to crowdfunding platform creator.
    modifier onlyCrowdOwner() {
        if (msg.sender != crowdCreator) revert OnlyCrowdOwner();
        _;
    }

    /** @notice Modifier that restricts to requests not yet completed. 
        @param idx The index of the corresponding request in the Requests array.
    */
    modifier requestNotCompleted(uint256 idx) {
        if (requests[idx].complete) revert RequestNotCompleted();
        _;
    }

    /** @notice Instantiate a Campaign.
        @param _minimumContribution the minimum contribution a person can add to a campaign.
        @param _targetValue the target amount to raise for the campaign.
        @param _maximumNFTContributors number of campaign contributers that will get an NFT bonus.
        @param _openDays the number of days the campaign will be open to new contributors.
        @param _campaignCreator denotes the creator of the campaign.
        @param _crowdCreator denotes the crowdfunding platform creator.
        @param _crowdNFTContractAddr the address of the NFT contract.
     */
    constructor(
        uint256 _minimumContribution,
        uint256 _targetValue,
        uint8 _maximumNFTContributors,
        uint256 _openDays,
        address _campaignCreator,
        address _crowdCreator,
        address _crowdNFTContractAddr
    ) {
        campaignCreator = payable(_campaignCreator);
        crowdCreator = payable(_crowdCreator);
        minimumContribution = _minimumContribution;
        targetValue = _targetValue;
        maximumNFTContributors = _maximumNFTContributors;
        crowdNFTContractAddr = _crowdNFTContractAddr;
        endDate = block.timestamp + (_openDays * 24 * 60 * 60);
    }

    /** @notice Contribute to a campaign. The first maximumNFTContributors are awarded an NFT.
        @dev Requires a msg.value > minimumContribution and date of contribution less than endDate.
        @param tokenURI is the metadata of the NFT.
    */
    function contribute(string calldata tokenURI) external payable {
        require(
            msg.value >= minimumContribution,
            "Not enough value for contribution!"
        );
        require(block.timestamp <= endDate, "Campaign already closed.");

        uint256 previousValue = approvers[msg.sender]; // Default 0

        raisedValue += msg.value;

        // Update staked value when address already approved other requests.
        for (uint256 idx = 0; idx < requests.length; idx++) {
            Request storage req = requests[idx];
            if (req.approvals[msg.sender] == RequestState.APPROVED)
                req.approvalValue += msg.value;
        }

        if (approvers[msg.sender] == 0) approversCount++; // New approver

        // Contributor is only awarded an NFT if it's one of the first to contribute.
        if (
            approversCount <= maximumNFTContributors &&
            approvers[msg.sender] != 0 &&
            bytes(tokenURI).length > 0
        ) CrowdNFT(crowdNFTContractAddr).mintNFT(msg.sender, tokenURI);

        approvers[msg.sender] = previousValue + msg.value;
    }

    /** @notice Create a request for the use of the campaign funds.
        @dev Only invokable by the campaign owner.
        @param _id Request ID.
        @param _value The mount of funds requested.
     */
    function createRequest(uint256 _id, uint256 _value)
        external
        onlyCampaignOwner
    {
        Request storage newRequest = requests.push();

        newRequest.id = _id;
        newRequest.value = _value;
        newRequest.complete = false;
        newRequest.approvalValue = 0;
        newRequest.openDate = block.timestamp;
    }

    /** @notice Vote for the approval of a request.
        @dev Only eligible to non-completed requests. Invocation only allowed by contributors that didn't approve the request before.
        @param idx The index of the corresponding request in the Requests array.
     */
    function approveRequest(uint256 idx) external requestNotCompleted(idx) {
        Request storage request = requests[idx];

        require(
            approvers[msg.sender] > 0,
            "Not elegible for approving requests. Turn into contributor first."
        );
        require(
            request.approvals[msg.sender] == RequestState.PENDING,
            "Already approved this request."
        );

        request.approvals[msg.sender] = RequestState.APPROVED;
        request.approvalValue += approvers[msg.sender];
    }

    /** @notice Close a campaign request.
        @dev Only eligible to non-completed requests approved by more than half of the contributors. Invocation allowed only by campaign owner. Charge 2% fee upon funds transfer.
        @param idx The index of the corresponding request in the Requests array.
     */
    function completeRequest(uint256 idx)
        external
        onlyCampaignOwner
        requestNotCompleted(idx)
    {
        Request storage request = requests[idx];

        require(
            request.approvalValue > (raisedValue / 2),
            "Not enough approvers."
        ); // Rounded towards 0

        // Transfer funds to campaignCreator and charge 2% fee
        uint8 royaltyFeePercentage = 2;
        uint256 royaltyAmount = (request.value * royaltyFeePercentage) / 100;

        campaignCreator.transfer(request.value - royaltyAmount);
        crowdCreator.transfer(royaltyAmount);
    }

    /** @notice Get number of requests so far.
        @return requestsCount Length of the requests array.
     */
    function getRequestsCount() public view returns (uint256 requestsCount) {
        return requests.length;
    }

    /** @notice Terminate contract.
        @dev Invocable only by crowdfunding platform creator. Funds are transfered accordingly.
    */
    function terminate() external onlyCrowdOwner {
        selfdestruct(crowdCreator);
    }
}
