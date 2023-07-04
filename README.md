# Holaplex Twitter Gated NFT Drop Starter

A template repository to help you drop NFT based on user action performed on twitter.

Includes:

- [NextJS](https://nextjs.org/) 13 web framework (app directory enabled)
- Redis
- User management with twitter based login through [next-auth](https://next-auth.js.org/)
- Holaplex Hub SDK

## Getting Started

Ensure you have nodejs-18 and yarn installed

```
# clone the repo to your local system
git clone git@github.com:thearyanag/twitter-gated-nft.git

# install dependencies
yarn install

# setup database
setup a database at https://docs.railway.app/ for free

# boot up the app
yarn dev
```

See your app at [http://localhost:3001](http://localhost:3001)

## Environment

Create a `.env.local` file at the root of the project. Add the following environment variable.

```
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=

NEXTAUTH_URL=
# from railways redis
REDIS_PORT=
REDIS_HOST=
REDIS_PASSWORD=
REDIS_USER=

TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=

# openssl 64 bit generated key for security
NEXTAUTH_SECRET=

# from holaplex console
HOLAPLEX_ACCESS_TOKEN=
# project id of which drop is part of
HOLAPLEX_PROJECT_ID=
# drop id which will be dropped to the user
HOLAPLEX_DROP_ID=
HOLAPLEX_API_URL=https://api.holaplex.com/graphql

# tweet 1 would always be a like and can be any tweet link
NEXT_PUBLIC_TWEET1_URL=https://twitter.com/SuperteamEarn/status/1674666819720974338?s=20
NEXT_PUBLIC_TWEET1_ACTION=LIKE

# tweet 2 can be RETWEET or QUOTE or REPLY or HASHTAG and can be any tweet link
NEXT_PUBLIC_TWEET2_URL=https://twitter.com/smf_bridges/status/1674669245488144387?s=20
NEXT_PUBLIC_TWEET2_ACTION=RETWEET

- incase of hashtag, it should be just a hashtag without the #, example : solana , not #solana

```

## Release
The starter is designed to be deployed to [vercel](https://vercel.com/) 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fthearyanag%2Ftwitter-gated-nft&env=TWITTER_ACCESS_TOKEN,TWITTER_ACCESS_SECRET,TWITTER_CLIENT_ID,TWITTER_CLIENT_SECRET,REDIS_HOST,REDIS_PORT,REDIS_PASSWORD,REDIS_USER,NEXTAUTH_SECRET,HOLAPLEX_ACCESS_TOKEN&project-name=holaplex-twitter)

### Environment Variables
You'll have to add the envrionment variables yourself.