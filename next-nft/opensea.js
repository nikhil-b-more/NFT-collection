const sdk = require("api")("@opensea/v1.0#7dtmkl3ojw4vb");

sdk
  .retrievingASingleAssetTestnets({
    asset_contract_address: "0xF912e97a413EB4b13313562675EfAd679Ce5c071",
    token_id: "1",
  })
  .then(({ data }) => console.log(data))
  .catch((err) => console.error(err));
