// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId;
  const img = `https://ipfs.io/ipfs/QmYnn5iZQqTeusPq2jnj7Y1uapxdMwtG3cRfP1LfGQcqn5?filename=ms-shr.png`;
  const name = "cryptoDev by Nikhil";
  const description = "created for project purpose only";

  return res.json({
    name: name + "Crypto Dev #" + tokenId,
    description: description,
    image: image_url + tokenId + ".png",
  });
}
