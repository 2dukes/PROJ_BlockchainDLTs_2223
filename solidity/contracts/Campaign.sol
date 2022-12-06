// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/// @title Campaign contract that includes all the necessary logic to run a campaign.
contract Campaign {
    /// @notice Denotes the state of a request.
    enum RequestState {
        APPROVED,
        PENDING
    }

    /// @notice Data structure responsible for a request to invest campaign funds.
    struct Request {
        uint id; // Stored externally as a mapping to a Request description.
        uint value;
        bool complete;
        mapping(address => RequestState) approvals;
        uint approvalCount;
    }

    /// @notice Array of campaign requests.
    Request[] public requests;

    /// @notice The campaign creator.
    address payable public campaignCreator;

    /// @notice The allowed contribution a person can add to a Campaign.
    uint public minimumContribution;

    /** @notice List of contributors and invested amount. 
        @dev Invested amount comes in Wei.
    */
    mapping(address => uint) public approvers;

    /// @notice A counter of the total contributors. 
    uint public approversCount;

    /** @notice Holds the end date of the contract.
        @dev Block.timestamp + OpenDays (in seconds).
    */
    uint public endDate;

    /** @notice Crowdfunding platform creator.
        @dev CampaignFactory contract creator.
    */
    address payable private crowdCreator;

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
    modifier requestNotCompleted(uint idx) {
        if(requests[idx].complete) revert RequestNotCompleted();
        _;
    }

    /** @notice Instantiate a Campaign.
        @param _minimumContribution the minimum contribution a person can add to a Campaign.
        @param _openDays the number of days the Campaign will be open to new contributors.
        @param _campaignCreator denotes the creator of the campaign.
        @param _crowdCreator denotes the crowdfunding platform creator.
     */
    constructor(
        uint _minimumContribution,
        uint _openDays,
        address _campaignCreator,
        address _crowdCreator
    ) {
        campaignCreator = payable(_campaignCreator);
        crowdCreator = payable(_crowdCreator);
        minimumContribution = _minimumContribution;
        endDate = block.timestamp + (_openDays * 24 * 60 * 60);
    }

    /** @notice Contribute to a campaign.
        @dev Requires a msg.value > minimumContribution and date of contribution less than endDate.
    */ 
    function contribute() external payable {
        require(
            msg.value >= minimumContribution,
            "Not enough value for contribution!"
        );
        require(block.timestamp <= endDate, "Campaign already closed.");

        uint previousValue = approvers[msg.sender]; // Default 0

        approvers[msg.sender] = previousValue + msg.value;
        if (approvers[msg.sender] == 0)
            // New approver
            approversCount++;
    }

    /** @notice Create a request for the use of the campaign funds.
        @dev Only invokable by the campaign owner.
        @param _id Request ID.
        @param _value The mount of funds requested.
     */
    function createRequest(uint _id, uint _value)
        external
        onlyCampaignOwner
    {
        Request storage newRequest = requests.push();

        newRequest.id = _id;
        newRequest.value = _value;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    /** @notice Vote for the approval of a request.
        @dev Only eligible to non-completed requests. Invocation only allowed by contributors that didn't approve the request before.
        @param idx The index of the corresponding request in the Requests array.
     */
    function approveRequest(uint idx) external requestNotCompleted(idx) {
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
        request.approvalCount++;
    }

    /** @notice Close a campaign request.
        @dev Only eligible to non-completed requests approved by more than half of the contributors. Invocation allowed only by campaign owner. Charge 2% fee upon funds transfer.
        @param idx The index of the corresponding request in the Requests array.
     */
    function completeRequest(uint idx) external onlyCampaignOwner requestNotCompleted(idx) {
        Request storage request = requests[idx];

        require(
            request.approvalCount > (approversCount / 2),
            "Not enough approvers."
        ); // Rounded towards 0

        // Transfer funds to campaignCreator and charge 2% fee
        uint8 royaltyFeePercentage = 2;
        uint royaltyAmount = (request.value * royaltyFeePercentage) / 100;

        campaignCreator.transfer(request.value - royaltyAmount);
        crowdCreator.transfer(royaltyAmount);
    }

    /** @notice Terminate contract.
        @dev Invocable only by crowdfunding platform creator. Funds are transfered accordingly.
    */
    function terminate() external onlyCrowdOwner {
        selfdestruct(crowdCreator);
    }
}
