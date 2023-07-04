import axios from "axios";
import { getPurchasedDrop } from "@/functions/graphql";

export default async (req, res) => {

    let { wallet } = req.body;

    console.log("wallet", wallet);

  let purchased = await getPurchasedDrop(wallet);

  console.log("purchased", purchased);

  return res.status(200).json(purchased);
};
