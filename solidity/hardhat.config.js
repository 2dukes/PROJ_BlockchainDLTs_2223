const path = require('path')

require("dotenv").config({ path: path.resolve(__dirname, '../.env') })
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { ALCHEMY_API_URL, WALLET_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: ALCHEMY_API_URL,
      accounts: [`0x${WALLET_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      goerli: `${ETHERSCAN_API_KEY}`
    }
  }
};
