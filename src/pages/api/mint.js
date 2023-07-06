import { mintNFT } from "@/functions/graphql";

export default async function handler(req, res) {
    let { wallet } = req.body;

    let response = await mintNFT(wallet);

    return res.status(200).json({ "status" : response });
}
