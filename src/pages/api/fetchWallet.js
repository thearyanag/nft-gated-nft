import {
  createCustomerWallet,
  mintNFT,
  createCustomer,
} from "@/functions/graphql";
import { getToken } from "next-auth/jwt";
import db from "@/functions/db";
import axios from "axios";

export default async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


  let client = db();

  if (token) {
    let userId = token.userProfile.userID;

    const user = await client.get(userId);

    console.log("user", user);
    if (!user) {
      let customerId = await createCustomer();
      let wallet = await createCustomerWallet(customerId);
      console.log("wallet", wallet);
      await client.set(userId, wallet);
      res.status(200).json({ wallet: wallet });
    } else {
      res.status(200).json({ wallet: user });
    }
  }
};
