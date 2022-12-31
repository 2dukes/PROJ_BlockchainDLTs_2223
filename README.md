# DApp: Crowdfunding Reinvented

## Setup

Install [MetaMask](https://metamask.io/) on your browser and connect it to the Goerli test network. Create an `.env` file in the project's root folder with the following structure:

```
ALCHEMY_API_URL = "https://eth-goerli.g.alchemy.com/v2/OMigXz2SzOnoSvOvI1YXiyDPDYRq6sUr"
WALLET_PRIVATE_KEY = "..."
ETHERSCAN_API_KEY = "1CIKT13TG7M115V5CQSRCT2QKGIIUZEYIX"
CAMPAIGN_CONTRACT_ADDR = "..."
MONGO_DB_ATLAS_USERNAME = "admin"
MONGO_DB_ATLAS_PASSWORD = "UTJtbKxUzoxQ3arP"
PINATA_API_KEY = "d2521bdd89920f00a4af"
PINATA_SECRET_API_KEY = "db6004caef4de67648925ba3f6356c4aad257b02024bb7eda06f2a3bf7f55bfd"
```

- `ALCHEMY_API_URL` which is Alchemy's API HTTPS entrypoint combined with the corresponding API Key.
- `WALLET_PRIVATE_KEY` which is your MetaMask's wallet private key.
- `ETHERSCAN_API_KEY` which is the Etherscan API key.
- `CAMPAIGN_CONTRACT_ADDR` which holds the address of the deployed campaign factory contract, as it will be seen in the next steps.
- `MONGO_DB_ATLAS_USERNAME` is the MongoDB container `MONGO_INITDB_ROOT_USERNAME` variable.
- `MONGO_DB_ATLAS_PASSWORD` is the MongoDB container `MONGO_INITDB_ROOT_PASSWORD` variable.
- `PINATA_API_KEY` is the Pinata API key.
- `PINATA_SECRET_API_KEY` is the Pinata API key secret.

## How to get Ether in your wallet?

Welcome the [Goerli Faucet](https://goerlifaucet.com/).

## Deploy Contracts

- Navigate to the `solidity/` folder. 
- Run `npm install`.
- Deploy:
    - [CampaignFactory.sol](./solidity/contracts/CampaignFactory.sol) using `npx hardhat run scripts/deployCampaign.mjs --network goerli`.

According to Hardhat's configurations, the deployment already includes the verification of the contracts in the Goerli Network, which an Ethereum Testnet. This means that the code of the Smart Contract is visible to everyone in [Etherscan](https://goerli.etherscan.io/).

## Frontend Running instructions:

> `docker-compose up`

## Frontend Rebuild instructions:

> `docker-compose up --build`

## Dependencies (*so far*):

- [Material UI](https://mui.com/material-ui/getting-started/overview/) which is a library of React UI components that implements Google's Material Design.
- [Hardhat](https://hardhat.org/) which is an Ethereum development environment for professionals. It facilitates performing frequent tasks, such as running tests, automatically checking code for mistakes or interacting with a Smart Contract.
- [OpenZeppelin](https://www.openzeppelin.com/) which provides security products to build, automate, and operate decentralized applications.
- [MetaMask](https://metamask.io/) which holds the crypto wallet.
- [Web3](https://web3js.readthedocs.io/en/v1.8.1/).
- [Pinata](https://www.pinata.cloud/)

**References:**
- [Solidity Documentation](https://docs.soliditylang.org/en/v0.8.17/index.html);
- [Web3 Documentation](https://web3js.readthedocs.io/en/v1.8.1/);
- [Alchemy](https://dashboard.alchemy.com/);
- [How to Create an NFT on Ethereum Tutorial](https://docs.alchemy.com/docs/how-to-create-an-nft#step-3-add-goerlieth-from-a-faucet);
- [How to Mint and NFT from Code](https://docs.alchemy.com/docs/how-to-mint-an-nft-from-code);
- [NatSpec Format](https://docs.soliditylang.org/en/develop/natspec-format.html).

## Contract Documentation

To generate the Solidity contract's documentation, first install the Solidity Compiler, [solc](https://docs.soliditylang.org/en/v0.8.17/installing-solidity.html#clone-the-repository). Then run `solc --pretty-json --devdoc /path/to/solidity/file`.
