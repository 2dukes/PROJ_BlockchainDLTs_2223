const ethers = require("ethers")
const contract = require("../contracts/CampaignFactory.json");

let signer;
let campaignContract;

const connectWallet = async () => {
    let provider;

    try {
        const { ethereum } = window;

        if (!ethereum)
            return { status: false, message: "Please install MetaMask!" };
        else if (
            typeof window !== "undefined" &&
            typeof window.ethereum !== "undefined"
        )
            provider = new ethers.providers.Web3Provider(window.ethereum);

        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner()

        await ethereum.request({
            method: "eth_requestAccounts",
        });

        // Get contract ABI and address
        const abi = contract.abi
        const contractAddress = process.env.REACT_APP_CAMPAIGN_CONTRACT_ADDR

        // Create a contract instance
        campaignContract = new ethers.Contract(contractAddress, abi, signer)

        console.log(signer._address)

        return {
            status: true,
            message: "Connected Wallet: " + signer,
        };
    } catch (error) {
        return {
            status: false,
            message: error,
        };
    }
};

export { connectWallet, signer, campaignContract };