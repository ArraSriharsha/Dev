import dotenv from 'dotenv';
import IORedis from 'ioredis';
dotenv.config();

export const redisConnection = new IORedis(process.env.REDIS_URL,{
    maxRetriesPerRequest: null,
});
