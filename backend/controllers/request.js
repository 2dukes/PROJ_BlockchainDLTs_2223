const { Request, Campaign } = require("../models/Campaign");

const storeRequestDetails = async (req, res, next) => {
    const { description } = req.body;
    const id = req.params.campaignAddress;
    
    try {
        const campaign = await Campaign.findOne({ id });
        const request = new Request({
            description
        });
        
        campaign.requests.push(request);
        const result = await request.save();

        return res.status(200).json({
            status: true,
            requestId: result._id
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { storeRequestDetails };