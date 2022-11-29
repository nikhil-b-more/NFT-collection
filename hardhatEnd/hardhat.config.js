require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: ".env"});

/** @type import('hardhat/config').HardhatUserConfig */
const URL = process.env.HTTP_URL;
const PVK = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.17",
  networks:{
    goerli:{
      url : URL,
      accounts: [PVK]
    }
  }
};
