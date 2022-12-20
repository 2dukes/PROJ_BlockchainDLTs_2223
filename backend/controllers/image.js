const fs = require('fs');
const path = require('path');

const storeImages = (req, res) => {
    const campaignAddress = req.body.campaignAddress;
    const campaignImage = req.files.campaignImage?.[0];
    const NFTs = req.files.nfts || [];

    const dirToWrite = path.join(__dirname, "..", 'public', 'campaigns', campaignAddress);

    if (!fs.existsSync(dirToWrite))
        fs.mkdirSync(dirToWrite);

    // Campaign Image
    if (campaignImage)
        fs.writeFileSync(path.join(__dirname, '..', 'public', 'campaigns', campaignAddress, 'campaignImage.png'), campaignImage.buffer, 'binary');
    else
        fs.copyFileSync(path.join(__dirname, '..', 'public', 'campaigns', 'default.png'), path.join(__dirname, "..", "public", "campaigns", campaignAddress, 'campaignImage.png'));

    for (let i = 0; i < NFTs.length; i++)
        fs.writeFileSync(path.join(__dirname, '..', 'public', 'campaigns', campaignAddress, `${i}.png`), NFTs[i].buffer, 'binary');

    return res.status(200).json({
        status: true,
        message: "Campaign images successfully stored.",
    });
};

module.exports = {
    storeImages
};