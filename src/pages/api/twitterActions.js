import { getToken } from "next-auth/jwt";
import db from "@/functions/db";

export default async (req, res) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("token", token);
};