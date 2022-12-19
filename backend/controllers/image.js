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
        fs.writeFileSync(path.join(__dirname, '..', 'public', 'campaigns', campaignAddress, 'campaignImage.png'), campaignImage.buffer, 'binary', (err) => {
            if (err) throw err;
            console.log('File saved.');
        });

    for (let i = 0; i < NFTs.length; i++) {
        fs.writeFileSync(path.join(__dirname, '..', 'public', 'campaigns', campaignAddress, `${i}.jpg`), NFTs[i].buffer, 'binary', (err) => {
            if (err) throw err;
            console.log('File saved.');
        });
    }

    return res.status(200).json({
        status: true,
        message: "Campaign images successfully stored.",
    });
};

module.exports = {
    storeImages
};