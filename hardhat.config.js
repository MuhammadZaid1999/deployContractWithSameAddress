require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { task } = require("hardhat/config");
const {
  API_URL_BSCTESTNET,
  API_URL_MUMBAI,
  API_URL_GORELI,
  PRIVATE_KEY,
} = process.env;

task("account", "returns nonce and balance for specified address on multiple networks")
  .addParam("address")
  .setAction(async address => {
    const web3Mumbai = createAlchemyWeb3(API_URL_MUMBAI);
    const web3BSCTESTNET = createAlchemyWeb3(API_URL_BSCTESTNET);
    const web3Goreli = createAlchemyWeb3(API_URL_GORELI);

    const networkIDArr = ["Polygon  Mumbai:","BSC TESTNET:", "ETH GORELI"]
    const providerArr = [web3Mumbai, web3BSCTESTNET, web3Goreli];
    const resultArr = [];
    
    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(address.address, "latest");
      const balance = await providerArr[i].eth.getBalance(address.address)
      resultArr.push([networkIDArr[i], nonce, parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2) + "ETH"]);
    }
    resultArr.unshift(["  |NETWORK|   |NONCE|   |BALANCE|  "])
    console.log(resultArr);
  })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    mumbai: {
      url: API_URL_MUMBAI,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    testnet: {
      url: API_URL_BSCTESTNET,
      chainId: 97,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    goerli: {
      url: API_URL_GORELI,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};