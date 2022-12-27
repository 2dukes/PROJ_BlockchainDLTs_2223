const { storeCampaignDetails, getCampaignDetails, buyCampaignProduct, getCampaigns, getMyCampaigns, getContributedCampaigns } = require("../controllers/campaign");

const express = require("express");
const router = express.Router();

router.post('/:campaignAddress', storeCampaignDetails);

router.get('/:campaignAddress', getCampaignDetails);

router.put('/:campaignAddress', buyCampaignProduct);

router.get('/', getCampaigns);

router.get('/personal/:personalAddress', getMyCampaigns);

router.get('/contribute/:personalAddress', getContributedCampaigns);

module.exports = router;