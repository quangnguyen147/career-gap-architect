import { createClient } from "redis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD

const url = REDIS_PASSWORD ? `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}` : `redis://${REDIS_HOST}:${REDIS_PORT}`;

export const redis = createClient({
  url
})


redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
