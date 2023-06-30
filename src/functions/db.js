import { createClient } from "redis";

let REDIS_URI = process.env.REDIS_URI;

let redisClient = createClient(REDIS_URI);

redisClient.on("connection", function () {
    console.log("Redis client connected");
});

redisClient.connect();

export default redisClient;