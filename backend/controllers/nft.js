const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const campaign = require("../contracts/Campaign.json");

const { ALCHEMY_API_URL, CAMPAIGN_CONTRACT_ADDR } = process.env;

const web3 = createAlchemyWeb3(ALCHEMY_API_URL);

const getPersonalNFTs = async (req, res, next) => {
    return res.status(200).json({
        status: true
    });
}

module.exports = { getPersonalNFTs };