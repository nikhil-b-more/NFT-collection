const { ethers } = require("hardhat");
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants");

async function main() {
  const contract = await ethers.getContractFactory("CryptoDevs");
  console.log("contract get");
  const whitelistContract = "0xc54539699Fb03c1aD1097cd3cD1e1180e1173d3B";
  // URL from where we can extract the metadata for a Crypto Dev NFT
  const metadataURL = "https://nft-collection-beryl-iota.vercel.app/";
  console.log(whitelistContract, metadataURL);
  const deployContract = await contract.deploy(metadataURL, whitelistContract);
  await deployContract.deployed();

  console.log("Crypto Devs Contract Address:", deployContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// npm hardhat run scripts/delpoy.js --network goerli
// 0x88066FCE13B2BC4aa713788f9F087973896e73c3
