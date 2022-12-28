const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const campaignFactory = require("../contracts/CampaignFactory.json");
const crowdNFT = require("../contracts/CrowdNFT.json");

const { ALCHEMY_API_URL, CAMPAIGN_CONTRACT_ADDR } = process.env;

const web3 = createAlchemyWeb3(ALCHEMY_API_URL);
const campaignFactoryContract = new web3.eth.Contract(campaignFactory.abi, CAMPAIGN_CONTRACT_ADDR);

const getPersonalNFTs = async (req, res, next) => {
    const personalAddress = req.params.personalAddress;

    try {
        const crowdNFTAddr = await campaignFactoryContract.methods.crowdNFTContractAddr().call();
        const crowdNFTContract = new web3.eth.Contract(crowdNFT.abi, crowdNFTAddr);

        let latestTokenID = await crowdNFTContract.methods._tokenIds().call();
        const numberTokens = await crowdNFTContract.methods.balanceOf(personalAddress).call();

        let currentNumberTokens = 0, ownedTokensIDs = [];

        while (currentNumberTokens < numberTokens && latestTokenID > 0) {
            const tokenOwner = await crowdNFTContract.methods.ownerOf(latestTokenID).call();

            if (tokenOwner.toLowerCase() === personalAddress.toLowerCase())
                ownedTokensIDs.push({
                    id: latestTokenID,
                    imageURL: `http://localhost:8000/${latestTokenID}.png`,
                    NFTLink: `https://testnets.opensea.io/assets/goerli/${crowdNFTAddr}/${latestTokenID}`
                });
            latestTokenID--;
        }

        return res.status(200).json({
            status: true,
            nfts: ownedTokensIDs
        });
    } catch (err) {
        next(err);
    }

};

module.exports = { getPersonalNFTs };