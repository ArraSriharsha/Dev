import { Worker } from 'bullmq';
import { generateFile, generateInputFile, executeCode } from '../utils/runcode.js';
import { cleanupTempFiles } from '../utils/cleanup.js';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { redisConnection } from '../config/redisConfig.js';

// Create worker for processing run jobs
const runWorker = new Worker('run-queue', async (job) => {
    console.log(`Processing run job ${job.id}`);
    const { code, language, input } = job.data;
    
    try {
        // Create execution directory
        const executionId = uuid();
        const rootDir = path.join(process.cwd(), `${executionId}`);
        if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir, { recursive: true });
        }

        // Generate files and execute code
        const filepath = await generateFile(rootDir, language, code);
        const inputfilePath = await generateInputFile(rootDir, input);
        const output = await executeCode(rootDir, filepath, language, inputfilePath, false);
        
        // Cleanup
        const dir = path.dirname(filepath);
        await cleanupTempFiles(dir);

        // Return result
        return {
            success: true,
            output: output.error ? {
                error: output.error,
                tle: output.tle || false
            } : output
        };
    } catch (error) {
        console.error(`Error processing run job ${job.id}:`, error);
        throw error;
    }
}, { connection: redisConnection });

// Worker event handlers
runWorker.on('error', (error) => {
    console.error('Run worker error:', error);
});

runWorker.on('failed', (job, error) => {
    console.error(`Run job ${job.id} failed:`, error);
});

runWorker.on('completed', (job) => {
    console.log(`Run job ${job.id} completed successfully`);
});

console.log('Run worker started and listening for jobs...'); 