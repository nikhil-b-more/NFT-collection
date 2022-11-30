import { ethers } from "hardhat";

import { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } from "../constants";
async function main() {
  const contract = await ethers.getContractFactory("CryptoDevs");

  const deployContract = await contract.deploy(
    METADATA_URL,
    WHITELIST_CONTRACT_ADDRESS
  );
  await deployContract.deployed();

  console.log("Crypto Devs Contract Address:", deployContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// npm hardhat run scripts/delpoy.js --network goerli
// 0x88066FCE13B2BC4aa713788f9F087973896e73c3
