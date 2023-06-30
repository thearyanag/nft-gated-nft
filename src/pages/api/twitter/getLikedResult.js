import { getToken } from "next-auth/jwt";
import Twitter from "twitter-lite";

export default async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET_KEY,
    access_token_key: token.credentials.accessToken,
    access_token_secret: token.credentials.accessTokenSecret,
  });
  const result = await client.get(
    `favorites/list.json?user_id=${userId}&count=200`
  );
  res.status(200).json(result);
};
