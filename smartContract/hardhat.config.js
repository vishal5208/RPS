require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// https://goerli.etherscan.io/address/0x5020D8cCF2f23ca80Aef51c29151C98DEDc1bf33#code

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",

  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/F3Hc1EXDRcJvePoF7-JwApfjLkHaDKo-",
      accounts: [process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2]
    },
  },


  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  sourcify: {
    enabled: true
  }
};
