require("dotenv").config();
const dayjs = require('dayjs');
const { Campaign, Order } = require("../models/Campaign");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const campaignFactory = require("../contracts/CampaignFactory.json");
const campaign = require("../contracts/Campaign.json");

const { ALCHEMY_API_URL, CAMPAIGN_CONTRACT_ADDR } = process.env;

const web3 = createAlchemyWeb3(ALCHEMY_API_URL);
const campaignFactoryContract = new web3.eth.Contract(campaignFactory.abi, CAMPAIGN_CONTRACT_ADDR);

const storeCampaignDetails = async (req, res, next) => {
    const { title, description } = req.body;
    const id = req.params.campaignAddress;

    try {
        const campaign = new Campaign({
            id,
            title,
            description
        });

        const result = await campaign.save();

        return res.status(200).json({
            status: true,
            campaignID: result._id,
        });
    } catch (err) {
        next(err);
    }
};

const buyCampaignProduct = async (req, res, next) => {
    const id = req.params.campaignAddress;
    const { name, email, sendingAddress } = req.body;

    try {
        const campaign = await Campaign.findOne({ id });
        const newOrder = new Order({
            name,
            email,
            address: sendingAddress
        });

        campaign.orders.push(newOrder);

        const result = await campaign.save();

        return res.status(200).json({
            status: true,
            orderID: result._id
        });
    } catch (err) {
        next(err);
    }
};

const getCampaignDetails = async (req, res, next) => {
    const id = req.params.campaignAddress;

    try {
        const campaign = await Campaign.findOne({ id });

        return res.status(200).json({
            status: true,
            campaignTitle: campaign.title,
            campaignDescription: campaign.description
        });
    } catch (err) {
        next(err);
    }
};

const getCampaigns = async (req, res, next) => {
    const pageNumber = req.query.pageNumber;
    const CAMPAIGNS_PER_PAGE = req.query.campaignsPerPage;

    try {
        let numCampaigns = await campaignFactoryContract.methods.getCampaignsCount().call();
        let campaignPromises = [];

        let indexOfLastResult = pageNumber * CAMPAIGNS_PER_PAGE;
        const indexOfFirstResult = indexOfLastResult - CAMPAIGNS_PER_PAGE;
        indexOfLastResult = (indexOfLastResult + 1 > numCampaigns) ? numCampaigns : indexOfLastResult;

        const numberCampaignsToDisplay = indexOfLastResult - indexOfFirstResult;

        for (let i = indexOfFirstResult; i < indexOfLastResult; i++)
            campaignPromises.push(campaignFactoryContract.methods.campaigns(i).call());

        const campaignAddresses = await Promise.all(campaignPromises);

        // console.log(campaignAddresses);

        let campaignObjs = new Array(numCampaigns).fill({});
        let campaignContracts = campaignAddresses.map(addr => new web3.eth.Contract(campaign.abi, addr));

        const methodNames = ["campaignCreator", "minimumContribution", "maximumNFTContributors", "raisedValue", "targetValue", "approversCount", "endDate", "unitsSold", "productPrice"];

        let campaignStrDataPromises = [];

        for (let i = 0; i < numberCampaignsToDisplay; i++) {
            // Fetch data from Campaign contract
            const campaignDataPromises = methodNames.map(name => campaignContracts[i].methods[name]().call());
            campaignDataPromises.push(web3.eth.getBalance(campaignAddresses[i])); // Get Balance
            const campaignData = await Promise.all(campaignDataPromises);

            // Fetch title and description from MongoDB
            campaignStrDataPromises.push(Campaign.findOne({ id: campaignAddresses[i] }));

            campaignObjs[i] = {
                address: campaignAddresses[i],
                balance: web3.utils.fromWei(campaignData.at(-1)),
                campaignCreator: campaignData[0],
                minimumContribution: web3.utils.fromWei(campaignData[1]),
                maximumNFTContributors: campaignData[2],
                raisedValue: web3.utils.fromWei(campaignData[3]),
                targetValue: web3.utils.fromWei(campaignData[4]),
                approversCount: campaignData[5],
                endDate: dayjs.unix(campaignData[6]).format('DD/MM/YYYY'),
                remainingDays: Math.round(dayjs.unix(campaignData[6]).diff(dayjs(), 'day', true)),
                unitsSold: campaignData[7],
                productPrice: web3.utils.fromWei(campaignData[8]),
                imageURL: `http://localhost:8000/${campaignAddresses[i]}/campaignImage.png`,
            };
        }

        const campaignStrData = await Promise.all(campaignStrDataPromises);

        for (let i = 0; i < numberCampaignsToDisplay; i++) {
            campaignObjs[i].title = campaignStrData[i].title;
            campaignObjs[i].description = campaignStrData[i].description;
        }

        // console.log(campaignObjs);

        return res.status(200).json({
            campaigns: campaignObjs,
            numCampaigns: parseInt(numCampaigns)
        });
    } catch (err) {
        next(err);
    }
};

const getMyCampaigns = async (req, res, next) => {
    const personalAddress = req.params.personalAddress;
    const pageNumber = req.query.pageNumber;
    const CAMPAIGNS_PER_PAGE = req.query.campaignsPerPage;

    try {
        let numCampaigns = await campaignFactoryContract.methods.getCampaignsCount().call();
        let campaignPromises = [];

        for (let i = 0; i < numCampaigns; i++)
            campaignPromises.push(campaignFactoryContract.methods.campaigns(i).call());

        let campaignAddresses = await Promise.all(campaignPromises);
        campaignPromises = [];

        let campaignContracts = campaignAddresses.map(addr => new web3.eth.Contract(campaign.abi, addr));
        
        for (let i = 0; i < numCampaigns; i++)
            campaignPromises.push(campaignContracts[i].methods.campaignCreator().call());
        
        const campaignCreators = await Promise.all(campaignPromises);

        campaignAddresses = campaignAddresses.filter((_, idx) => campaignCreators[idx].toLowerCase() === personalAddress.toLowerCase());
        numCampaigns = campaignAddresses.length;
        campaignContracts = campaignAddresses.map(addr => new web3.eth.Contract(campaign.abi, addr));


        let indexOfLastResult = pageNumber * CAMPAIGNS_PER_PAGE;
        const indexOfFirstResult = indexOfLastResult - CAMPAIGNS_PER_PAGE;
        indexOfLastResult = (indexOfLastResult + 1 > numCampaigns) ? numCampaigns : indexOfLastResult;

        const numberCampaignsToDisplay = indexOfLastResult - indexOfFirstResult;

        let campaignObjs = new Array(numCampaigns).fill({});

        const methodNames = ["campaignCreator", "minimumContribution", "maximumNFTContributors", "raisedValue", "targetValue", "approversCount", "endDate", "unitsSold", "productPrice"];

        let campaignStrDataPromises = [];

        for (let i = 0; i < numberCampaignsToDisplay; i++) {
            // Fetch data from Campaign contract
            const campaignDataPromises = methodNames.map(name => campaignContracts[i].methods[name]().call());
            campaignDataPromises.push(web3.eth.getBalance(campaignAddresses[i])); // Get Balance
            const campaignData = await Promise.all(campaignDataPromises);

            // Fetch title and description from MongoDB
            campaignStrDataPromises.push(Campaign.findOne({ id: campaignAddresses[i] }));

            campaignObjs[i] = {
                address: campaignAddresses[i],
                balance: web3.utils.fromWei(campaignData.at(-1)),
                campaignCreator: campaignData[0],
                minimumContribution: web3.utils.fromWei(campaignData[1]),
                maximumNFTContributors: campaignData[2],
                raisedValue: web3.utils.fromWei(campaignData[3]),
                targetValue: web3.utils.fromWei(campaignData[4]),
                approversCount: campaignData[5],
                endDate: dayjs.unix(campaignData[6]).format('DD/MM/YYYY'),
                remainingDays: Math.round(dayjs.unix(campaignData[6]).diff(dayjs(), 'day', true)),
                unitsSold: campaignData[7],
                productPrice: web3.utils.fromWei(campaignData[8]),
                imageURL: `http://localhost:8000/${campaignAddresses[i]}/campaignImage.png`,
            };
        }

        const campaignStrData = await Promise.all(campaignStrDataPromises);

        for (let i = 0; i < numberCampaignsToDisplay; i++) {
            campaignObjs[i].title = campaignStrData[i].title;
            campaignObjs[i].description = campaignStrData[i].description;
        }

        // console.log(campaignObjs);

        return res.status(200).json({
            campaigns: campaignObjs,
            numCampaigns: parseInt(numCampaigns)
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { storeCampaignDetails, getCampaignDetails, buyCampaignProduct, getCampaigns, getMyCampaigns };