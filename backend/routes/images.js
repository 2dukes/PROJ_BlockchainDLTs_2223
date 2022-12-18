const { storeImages } = require("../controllers/images");

const express = require("express");
const router = express.Router();

router.get('/', storeImages);

module.exports = router;