import { Worker } from 'bullmq';
import { evaluateSubmission } from '../utils/submitcode.js';
import submission from '../models/Submissions.js';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import DBConnection from '../database/db.js';
import { cleanupTempFiles } from '../utils/cleanup.js';
import { redisConnection } from '../config/redisConfig.js';

// Immediately invoked async function
(async () => {
    await DBConnection(); // wait for DB to connect before processing

    console.log('Connected to DB. Starting submission worker...');

    const submissionWorker = new Worker('submission-queue', async (job) => {
        const { submissionId, problemId, code, language } = job.data;
        let rootDir = null;

        try {
            const subDoc = await submission.findById(submissionId);
            if (!subDoc) throw new Error('Submission not found');

            const processDir = process.cwd();
            const executionId = uuid();
            rootDir = path.join(processDir, `${executionId}`);
            if (!fs.existsSync(rootDir)) {
                fs.mkdirSync(rootDir, { recursive: true });
            }

            subDoc.status = 'Processing';
            await subDoc.save();

            const result = await evaluateSubmission(problemId, code, language, submissionId, rootDir);
            if (result.error) {
                subDoc.status = 'WA';
                subDoc.error = result.error;
                await subDoc.save();
                return { success: false, submissionId, result };
            }
            return { success: true, submissionId, result };

        } catch (error) {
            const subDoc = await submission.findById(submissionId);
            if (subDoc) {
                subDoc.status = 'Error';
                subDoc.error = error.message;
                await subDoc.save();
            }
            throw error;
        } finally {
            // Clean up files in all cases
            if (rootDir) {
                try {
                    await cleanupTempFiles(rootDir);
                } catch (cleanupError) {
                    console.error('Error cleaning up files:', cleanupError);
                }
            }
        }
    }, { connection : redisConnection});

    // Worker event handlers
    submissionWorker.on('error', (error) => {
        console.error('Submission worker error:', error);
    });

    submissionWorker.on('failed', (job, error) => {
        console.error(`Submission job ${job.id} failed:`, error);
    });

    submissionWorker.on('completed', (job) => {
        console.log(`Submission job ${job.id} completed successfully`);
    });

    console.log('Submission worker started');
})();
