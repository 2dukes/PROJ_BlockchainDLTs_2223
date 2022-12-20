const { Campaign, Order } = require("../models/Campaign");

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

module.exports = { storeCampaignDetails, getCampaignDetails, buyCampaignProduct };