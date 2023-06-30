import { getToken } from "next-auth/jwt";
import Twitter from "twitter-lite";

export default async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("token", token);

  console.log("process.env.TWITTER_ACCESS_TOKEN", process.env.TWITTER_ACCESS_TOKEN);
  console.log("process.env.TWITTER_ACCESS_SECRET", process.env.TWITTER_ACCESS_SECRET);
  console.log("token.credentials.authToken", token.credentials.authToken);
  console.log("token.credentials.authSecret", token.credentials.authSecret);

  const client = new Twitter({
    consumer_key: process.env.TWITTER_ACCESS_TOKEN,
    consumer_secret: process.env.TWITTER_ACCESS_SECRET,
    access_token_key: token.credentials.authToken,
    access_token_secret: token.credentials.authSecret,
    version: "2",
    extension: false,
  });

  let tweet1_url = process.env.NEXT_PUBLIC_TWEET1_URL;
  let tweet1_action = process.env.NEXT_PUBLIC_TWEET1_ACTION;

  let tweet2_url = process.env.NEXT_PUBLIC_TWEET2_URL;
  let tweet2_action = process.env.NEXT_PUBLIC_TWEET2_ACTION;

  let tweet_url;
  if (tweet1_action == "LIKE") {
    tweet_url = tweet1_url;
  } else if (tweet2_action == "LIKE") {
    tweet_url = tweet2_url;
  }
  if (tweet_url == undefined) {
    res.status(200).json({ message: "No tweet to like" });
    return;
  }

  let tweetId = tweet_url.split("/").pop();
  if (tweetId.endsWith("?s=20")) {
    tweetId = tweetId.substring(0, tweetId.length - 5);
  }
  const result = await client.get(`users/${token.userProfile.userID}/liked_tweets`);
  console.log("result", result);
  res.status(200).json(result);
};
