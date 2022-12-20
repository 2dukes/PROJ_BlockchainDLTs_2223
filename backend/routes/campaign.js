const { storeCampaignDetails, getCampaignDetails, buyCampaignProduct } = require("../controllers/campaign");

const express = require("express");
const router = express.Router();

router.post('/:campaignAddress', storeCampaignDetails);

router.get('/:campaignAddress', getCampaignDetails);

router.put('/:campaignAddress', buyCampaignProduct);

module.exports = router;