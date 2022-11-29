// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId;
  const img = `https://github.com/LearnWeb3DAO/NFT-Collection/blob/main/my-app/public/cryptodevs/${tokenId}-1.svg`;
  const name = "cryptoDev by Nikhil";
  const description = "created for project purpose only";

  return res.json({
    name: name,
    description: description,
    image: img,
  });
}
