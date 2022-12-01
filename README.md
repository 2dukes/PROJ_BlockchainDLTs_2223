# Dapp: Crowdfunding Reinvented

## Setup

Install [Metamask](https://metamask.io/) on your browser. Create an `.env` file in the project's root folder with the following structure:

```
ALCHEMY_API_URL = "https://eth-goerli.g.alchemy.com/v2/OMigXz2SzOnoSvOvI1YXiyDPDYRq6sUr"
WALLET_PRIVATE_KEY = "..."
ETHERSCAN_API_KEY = "1CIKT13TG7M115V5CQSRCT2QKGIIUZEYIX"
CAMPAIGN_CONTRACT_ADDR = "..."
```

- `ALCHEMY_API_URL` which is Alchemy's API HTTPS entrypoint combined with the corresponding API Key.
- `WALLET_PRIVATE_KEY` which is your MetaMask's wallet private key.
- `ETHERSCAN_API_KEY` which is the Etherscan API key.
- `CAMPAIGN_CONTRACT_ADDR` which holds the address of the deployed campaign contract, as it will be seen in the next steps.
## How to get Ether in your wallet?

Welcome the [Goerli Faucet](https://goerlifaucet.com/).
## Deploy Contracts

- Navigate to the `solidity/` folder. 
- Run `npm install`.
- Deploy:
    - [CampaignFactory.sol](./solidity/contracts/CampaignFactory.sol) using `npx hardhat run scripts/deployCampaign.mjs --network goerli`.
    - [CrowdNFT.sol](./solidity/contracts/CrowdNFT.sol) using `npx hardhat run scripts/deployNFT.mjs --network goerli`.

According to Hardhat's configurations, the deployment already includes the verification of the contracts in the Goerli Network, which an Ethereum Testnet. This means that the code of the Smart Contract is visible to everyone in [Etherscan](https://goerli.etherscan.io/).

**Running instructions:**

> `docker-compose up`

**Rebuild instructions:**

> `docker-compose up --build`

## Dependencies (*so far*):

- [Material UI](https://mui.com/material-ui/getting-started/overview/) which is a library of React UI components that implements Google's Material Design.
- [Hardhat](https://hardhat.org/) which is an Ethereum development environment for professionals. It facilitates performing frequent tasks, such as running tests, automatically checking code for mistakes or interacting with a Smart Contract.
- [OpenZeppelin](https://www.openzeppelin.com/) which provides security products to build, automate, and operate decentralized applications.
- [MetaMask](https://metamask.io/) which holds the crypto wallet.
- [Ethers](https://docs.ethers.io/v5/).

**References:**
- [Solidity Documentation](https://docs.soliditylang.org/en/v0.8.17/index.html);
- [Ethers Documentation](https://docs.ethers.io/v5/).
- [Alchemy](https://dashboard.alchemy.com/);
- [How to Create an NFT on Ethereum Tutorial](https://docs.alchemy.com/docs/how-to-create-an-nft#step-3-add-goerlieth-from-a-faucet);
- [How to Mint and NFT from Code](https://docs.alchemy.com/docs/how-to-mint-an-nft-from-code).

## Example Contract Deployments
- [CrowdNFT.sol](./solidity/contracts/CrowdNFT.sol), [here](https://goerli.etherscan.io/address/0x5f68fcc1f4eb0246e66278b600aa2ea6d4517ba4).
- [CampaignFactory.sol](./solidity/contracts/CampaignFactory.sol), [here](https://goerli.etherscan.io/address/0x55d7ff88e359de266ed81f49a605b4f7a8a21e62).