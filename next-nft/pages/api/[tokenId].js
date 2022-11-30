// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId;
  const img = `https://ipfs.io/ipfs/QmYnn5iZQqTeusPq2jnj7Y1uapxdMwtG3cRfP1LfGQcqn5?filename=ms-shr-${tokenId}.png`;

  const description = "created for project purpose only";

  return res.status(200).json({
    name: "Crypto Dev #" + tokenId,
    description: description,
    image: img,
  });
}
