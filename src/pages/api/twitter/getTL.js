import { getToken } from "next-auth/jwt";
import Twitter from "twitter-lite";

export default async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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
  let tweet_action;
  if (tweet1_action == "LIKE") {
    tweet_url = tweet2_url;
    tweet_action = tweet2_action;
  } else if (tweet2_action == "LIKE") {
    tweet_url = tweet1_url;
    tweet_action = tweet1_action;
  }

  if (tweet_url == undefined) {
    res.status(200).json({ message: "No tweet to like" });
    return;
  }

  let tweetId = tweet_url.split("/").pop();
  if (tweetId.endsWith("?s=20")) {
    tweetId = tweetId.substring(0, tweetId.length - 5);
  }

  if (tweet_action == "RETWEET") tweet_action = "retweeted";
  else if (tweet_action == "QUOTE") tweet_action = "quoted";
  else if (tweet_action == "REPLY") tweet_action = "replied_to";

  let userId = token.sub;
  const result = await client.get(
    `users/${userId}/tweets?tweet.fields=referenced_tweets&expansions=referenced_tweets.id`
  );
  let data = result.data;

  for (let i = 0; i < data.length; i++) {
    if (data[i]["referenced_tweets"]) {
      if (data[i]["referenced_tweets"][0]["id"] == tweetId) {
        let type = data[i]["referenced_tweets"][0]["type"];
        if (type == tweet_action) {
          res.status(200).json({ status: true });
          return;
        } else {
          res.status(200).json({ status: false });
          return;
        }
      }
    }
  }
  res.status(200).json({ status: false });
};
