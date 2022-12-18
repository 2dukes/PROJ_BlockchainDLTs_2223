const { storeCampaignDetails } = require("../controllers/campaign");

const express = require("express");
const router = express.Router();

router.post('/', storeCampaignDetails);

module.exports = router;