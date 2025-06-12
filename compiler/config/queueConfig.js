import { Queue } from 'bullmq';
import { redisConnection } from './redisConfig.js';

// Queues
const runQueue = new Queue('run-queue', { connection: redisConnection });
const submissionQueue = new Queue('submission-queue', { connection: redisConnection });

// Queue Monitoring (optional, can be removed in prod)
const monitorQueues = async () => {
  const [runStatus, submissionStatus] = await Promise.all([
    runQueue.getJobCounts(),
    submissionQueue.getJobCounts()
  ]);

  console.log('📊 Queue Status:', {
    runQueue: runStatus,
    submissionQueue: submissionStatus
  });
};

// Monitor every 30 seconds
setInterval(monitorQueues, 30000);

// Export queues for processors/workers
export { runQueue, submissionQueue };
