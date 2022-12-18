const { storeImages } = require("../controllers/images");

const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();

router.post('/', upload.fields([{ name: "campaignImage", maxCount: 1 }, { name: "nfts" }]), storeImages);

module.exports = router;