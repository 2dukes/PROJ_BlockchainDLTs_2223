const { storeImages, getNFTImage, moveNFTImage } = require("../controllers/image");

const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();

router.post('/:campaignAddress', upload.fields([{ name: "campaignImage", maxCount: 1 }, { name: "nfts" }]), storeImages);

router.get('/nft/:campaignAddress', getNFTImage);

router.post('/nft/:campaignAddress/:imgIndex', moveNFTImage);

module.exports = router;