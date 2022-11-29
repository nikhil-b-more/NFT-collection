// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId;
  const img = `https://raw.githubusercontent.com/LearnWeb3DAO/NFT-Collection/main/my-app/public/cryptodevs/${tokenId}.svg`;
  const name = "cryptoDev by Nikhil";
  const description = "created for project purpose only";

  return res.json({
    name: name,
    description: description,
    image: img,
  });
}
