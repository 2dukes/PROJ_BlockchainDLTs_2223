require("dotenv").config();
const fs = require('fs');
const path = require('path');

const { PINATA_API_KEY, PINATA_SECRET_API_KEY } = process.env;

const storeImages = (req, res) => {
    const campaignAddress = req.params.campaignAddress;
    const campaignImage = req.files.campaignImage?.[0];
    const NFTs = req.files.nfts || [];

    const dirToWrite = path.join(__dirname, '..', 'public', 'campaigns', campaignAddress);

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

const getNFTImage = async (req, res, next) => {
    const campaignAddress = req.params.campaignAddress;
    const title = req.query.nftTitle;
    const description = req.query.nftDescription;

    const dirToWrite = path.join(__dirname, '..', 'public', 'campaigns', campaignAddress);
    if (fs.existsSync(dirToWrite)) {
        let imgIndex = 0;
        while (fs.existsSync(path.join(__dirname, '..', 'public', 'campaigns', campaignAddress, `${imgIndex}.png`))) {
            imgIndex++;
        }

        imgIndex--;
        if (imgIndex >= 0) {
            const imagePath = `http://localhost:8000/${campaignAddress}/${imgIndex}.png`;
            const data = new FormData();
            const imageResponse = await fetch(imagePath);
            const imageBlob = await imageResponse.blob();

            data.append('file', imageBlob);

            try {
                const pinataResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                    method: "POST",
                    maxContentLength: Infinity,
                    headers: {
                        pinata_api_key: PINATA_API_KEY,
                        pinata_secret_api_key: PINATA_SECRET_API_KEY,
                    },
                    body: data
                });

                const pinataResponseJSON = await pinataResponse.json();

                console.log(pinataResponseJSON);

                const options = {
                    pinataOptions: {
                        "cidVersion": 1
                    },
                    pinataContent: {
                        name: title,
                        description: description,
                        image: `https://gateway.pinata.cloud/ipfs/${pinataResponseJSON.IpfsHash}`
                    }
                };

                const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        pinata_api_key: PINATA_API_KEY,
                        pinata_secret_api_key: PINATA_SECRET_API_KEY,
                    },
                    body: JSON.stringify(options)
                });

                const resJSON = await response.json();

                console.log(resJSON);

                return res.status(200).json({
                    status: true,
                    imageIndex: imgIndex,
                    IpfsHash: resJSON.IpfsHash
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    return res.status(400).json({
        status: false,
        message: "No images available."
    });
};

const moveNFTImage = (req, res, next) => {
    const campaignAddress = req.params.campaignAddress;
    const imageIndex = req.params.imgIndex;
    const tokenID = req.query.tokenID;

    const sourcePath = path.join(__dirname, '..', 'public', 'campaigns', campaignAddress, `${imageIndex}.png`);
    const destinationPath = path.join(__dirname, '..', 'public', 'nfts', `${tokenID}.png`);

    try {
        if (fs.existsSync(sourcePath))
            fs.renameSync(sourcePath, destinationPath);

        return res.status(200).json({
            status: true,
            message: "File successfully moved!"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    storeImages,
    getNFTImage,
    moveNFTImage
};