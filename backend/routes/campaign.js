const { storeCampaignDetails, getCampaignDetails, buyCampaignProduct, getCampaigns } = require("../controllers/campaign");

const express = require("express");
const router = express.Router();

router.post('/:campaignAddress', storeCampaignDetails);

router.get('/:campaignAddress', getCampaignDetails);

router.put('/:campaignAddress', buyCampaignProduct);

router.get('/', getCampaigns);

module.exports = router;