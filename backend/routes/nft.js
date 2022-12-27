const { getPersonalNFTs } = require("../controllers/nft");

const express = require("express");
const router = express.Router();

router.post('/:personalAddress', getPersonalNFTs);

module.exports = router;