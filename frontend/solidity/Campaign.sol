// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Campaign {
    struct Request {
        uint256 id; // Stored externally as a mapping to a Request description.
        uint256 value;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    Request[] public requests;
    address payable public campaignCreator;
    uint256 public minimumContribution;
    mapping(address => uint256) public approvers;
    uint256 public approversCount;
    uint256 public endDate;
    address payable private crowdCreator;

    modifier onlyCampaignOwner() {
        require(
            msg.sender == campaignCreator,
            "Only invokable by campaign's owner."
        );
        _;
    }

    modifier onlyCrowdOwner() {
        require(
            msg.sender == crowdCreator,
            "Only invokable by Crowdfunding's owner."
        );
        _;
    }

    constructor(
        uint256 _minimumContribution,
        uint256 _openDays,
        address _campaignCreator,
        address _crowdCreator
    ) {
        campaignCreator = payable(_campaignCreator);
        crowdCreator = payable(_crowdCreator);
        minimumContribution = _minimumContribution;
        endDate = block.timestamp + (_openDays * 24 * 60 * 60);
    }

    function contribute() public payable {
        require(
            msg.value >= minimumContribution,
            "Not enough value for contribution!"
        );
        require(block.timestamp <= endDate, "Campaign already closed.");

        uint256 previousValue = approvers[msg.sender]; // Default 0

        approvers[msg.sender] = previousValue + msg.value;
        if (approvers[msg.sender] == 0)
            // New approver
            approversCount++;
    }

    function createRequest(uint256 _id, uint256 _value)
        public
        onlyCampaignOwner
    {
        Request storage newRequest = requests.push();

        newRequest.id = _id;
        newRequest.value = _value;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 idx) public {
        Request storage request = requests[idx];

        require(
            approvers[msg.sender] > 0,
            "Not elegible for approving requests. Turn into contributor first."
        );
        require(
            !request.approvals[msg.sender],
            "Already approved this request."
        );
        require(!request.complete, "Request already completed.");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function completeRequest(uint256 idx) public onlyCampaignOwner {
        Request storage request = requests[idx];

        require(
            request.approvalCount > (approversCount / 2),
            "Not enough approvers."
        ); // Rounded towards 0
        require(!request.complete, "Request already completed.");

        // Transfer funds to campaignCreator and charge 2% fee
        uint256 crowdFee = request.value / 50;

        campaignCreator.transfer(request.value - crowdFee);
        crowdCreator.transfer(crowdFee);
    }

    function terminate() public onlyCrowdOwner {
        selfdestruct(crowdCreator);
    }
}
