import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectRedis } from "./config/redis.config.js";
import prisma from "./config/prisma.config.js";
import { workerPool } from "./services/workerPool.service.js";

const PORT = process.env.PORT || 3000;

await connectRedis();

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);

    });
  } catch (error) {
    console.error('❌ Server failed to start', error);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGINT', async () => {
  console.log("SIGINT received");

  await workerPool.shutdown();
  await prisma.$disconnect();
  process.exit(0);
});
