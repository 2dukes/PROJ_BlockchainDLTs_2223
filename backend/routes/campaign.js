const { storeCampaignDetails, getCampaignDetails } = require("../controllers/campaign");

const express = require("express");
const router = express.Router();

router.post('/store', storeCampaignDetails);

router.get('/get', getCampaignDetails);

module.exports = router;