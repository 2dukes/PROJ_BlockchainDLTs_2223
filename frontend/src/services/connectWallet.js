const Web3 = require("web3");
const contract = require("../contracts/CampaignFactory.json");

let web3;
let campaignFactoryContract;

const connectWallet = async () => {
    try {
        const { ethereum } = window;

        if (!ethereum)
            return { status: false, message: "Please install MetaMask!" };
        else if (
            typeof window !== "undefined" &&
            typeof window.ethereum !== "undefined"
        )
            web3 = new Web3(ethereum);

        await ethereum.request({
            method: "eth_requestAccounts",
        });

        // Get contract ABI and address
        const abi = contract.abi;
        const contractAddress = process.env.REACT_APP_CAMPAIGN_CONTRACT_ADDR;

        // Create a contract instance
        campaignFactoryContract = new web3.eth.Contract(abi, contractAddress);

        return {
            status: true,
            message: "Connected Wallet: " + ethereum.selectedAddress,
        };
    } catch (error) {
        return {
            status: false,
            message: error,
        };
    }
};

const disconnectWallet = () => {
    web3 = undefined;
    campaignFactoryContract = undefined;
};

export { connectWallet, disconnectWallet, web3, campaignFactoryContract };