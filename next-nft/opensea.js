const sdk = require("api")("@opensea/v1.0#7dtmkl3ojw4vb");

sdk
  .retrievingASingleAssetTestnets({
    asset_contract_address: "0xe23327395DaFC265BD28B1e7647f0ec065c0214d",
    token_id: "1",
  })
  .then(({ data }) => console.log(data))
  .catch((err) => console.error(err));
