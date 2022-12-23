const { storeRequestDetails } = require("../controllers/request");

const express = require("express");
const router = express.Router();

router.post('/:campaignAddress', storeRequestDetails);

module.exports = router;