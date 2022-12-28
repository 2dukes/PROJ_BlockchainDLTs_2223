const { getPersonalNFTs } = require("../controllers/nft");

const express = require("express");
const router = express.Router();

router.get('/:personalAddress', getPersonalNFTs);

module.exports = router;