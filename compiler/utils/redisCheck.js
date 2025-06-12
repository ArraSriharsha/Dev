import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { redisConnection } from '../config/redisConfig.js';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL;

const checkRedisConnection = async () => {
  console.log('🔍 Starting Redis connection check...');
  console.log('🔗 Redis URL:', REDIS_URL);

  try {
    console.log('🔌 Attempting direct Redis connection...');
    // Use ioredis for direct connection
    const directClient = new IORedis(REDIS_URL);
    directClient.on('error', (err) => {
      console.error('❗ Redis client error:', err);
    });
    directClient.on('connect', () => {
      console.log('✅ Redis client connected');
    });
    await directClient.ping();
    console.log('✅ Direct Redis connection successful');
    await directClient.quit();
    console.log('🔌 Redis client disconnected');

    console.log('\n🔁 Attempting BullMQ queue connection...');
    const testQueue = new Queue('connection-test', { connection: redisConnection });
    testQueue.on('error', (error) => {
      console.error('❌ BullMQ queue error:', error);
    });
    console.log('📤 Adding test job...');
    const testJob = await testQueue.add('test', { test: true });
    console.log(`✅ BullMQ test job added (ID: ${testJob.id})`);
    console.log('🧹 Cleaning up test job...');
    await testJob.remove();
    console.log('🚪 Closing test queue...');
    await testQueue.close();
    console.log('✅ Queue closed');
    return true;
  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    throw error;
  }
};

// Execute
console.log('🏁 Running Redis connection check...');
checkRedisConnection()
  .then(() => {
    console.log('🎉 Redis connection check completed successfully');
  })
  .catch((error) => {
    console.error('🔥 Redis connection check failed:', error);
    process.exit(1);
  });

export default checkRedisConnection;
