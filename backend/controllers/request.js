const { Request, Campaign } = require("../models/Campaign");
const dayjs = require('dayjs');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const campaign = require("../contracts/Campaign.json");

const { ALCHEMY_API_URL, CAMPAIGN_CONTRACT_ADDR } = process.env;

const web3 = createAlchemyWeb3(ALCHEMY_API_URL);

const storeRequestDetails = async (req, res, next) => {
    const { description } = req.body;
    const id = req.params.campaignAddress;

    try {
        const campaign = await Campaign.findOne({ id });
        const request = new Request({
            description
        });

        campaign.requests.push(request);
        const result = await campaign.save();

        return res.status(200).json({
            status: true,
            requestId: result._id
        });
    } catch (err) {
        next(err);
    }
};

const getRequestDetails = async (req, res, next) => {
    const id = req.params.campaignAddress;
    const personalAddress = req.query.personalAddress;

    try {
        const campaignObj = await Campaign.findOne({ id });
        const requestsStr = campaignObj.requests.map((request) => { return { description: request.description }; });

        const campaignContract = new web3.eth.Contract(campaign.abi, id);
        const requestPromises = [], isApprovedPromises = [];

        for (let i = 0; i < requestsStr.length; i++) {
            requestPromises.push(campaignContract.methods.requests(i).call());
            isApprovedPromises.push(campaignContract.methods.hasApprovedRequest(i, personalAddress).call());
        }

        const requestData = await Promise.all(requestPromises);
        const isApprovedData = await Promise.all(isApprovedPromises);

        const raisedValue = web3.utils.fromWei(await campaignContract.methods.raisedValue().call());

        let r = requestData.map((request, idx) => {
            return {
                id: idx,
                description: requestsStr[idx].description,
                askedValue: web3.utils.fromWei(request.value),
                complete: request.complete,
                isApproved: Boolean(parseInt(isApprovedData[idx])),
                openDate: dayjs.unix(request.openDate).format('DD/MM/YYYY'),
                approvalCount: `${web3.utils.fromWei(request.approvalValue)}/${raisedValue}`,
                canFinalize: web3.utils.fromWei(request.approvalValue) > (raisedValue / 2)
            };
        });

        return res.status(200).json({
            status: true,
            requests: r
        });

    } catch (err) {
        next(err);
    }
};

module.exports = { storeRequestDetails, getRequestDetails };