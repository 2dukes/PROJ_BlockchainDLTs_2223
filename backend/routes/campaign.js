const { storeCampaignDetails, getCampaignDetails } = require("../controllers/campaign");

const express = require("express");
const router = express.Router();

router.post('/:campaignAddress', storeCampaignDetails);

router.get('/:campaignAddress', getCampaignDetails);

module.exports = router;