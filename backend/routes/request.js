const { storeRequestDetails, getRequestDetails } = require("../controllers/request");

const express = require("express");
const router = express.Router();

router.post('/:campaignAddress', storeRequestDetails);

router.get('/:campaignAddress', getRequestDetails);

module.exports = router;