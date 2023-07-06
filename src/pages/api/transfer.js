import { transferNFT } from "@/functions/graphql";

export default async function handler(req, res) {
    let { wallet , mintId} = req.body;

    console.log("wallet", wallet);
    console.log("mintId", mintId);

    let response = await transferNFT(wallet , mintId);

    return res.status(200).json({ "status" : response });
}
