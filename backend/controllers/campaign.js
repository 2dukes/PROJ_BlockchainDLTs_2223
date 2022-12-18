const Campaign = require("../models/Campaign");

const storeCampaignDetails = async (req, res) => {
    const { id, title, description } = req.body;

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

module.exports = { storeCampaignDetails };