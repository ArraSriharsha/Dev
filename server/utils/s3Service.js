import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export const uploadTestCases = async (problemTitle, inputContent, outputContent) => {
    try {
        const inputKey = `testcases/${problemTitle}/input.txt`;
        const outputKey = `testcases/${problemTitle}/output.txt`;

        // Upload input file
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: inputKey,
            Body: inputContent,
            ContentType: 'text/plain'
        }));

        // Upload output file
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: outputKey,
            Body: outputContent,
            ContentType: 'text/plain'
        }));

        return {
            inputKey,
            outputKey
        };
    } catch (error) {
        throw new Error(`Failed to upload test cases to S3: ${error.message}`);
    }
};

export const deleteTestCases = async (inputKey, outputKey) => {
    try {
        // Delete input file
        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: inputKey
        }));

        // Delete output file
        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: outputKey
        }));
    } catch (error) {
        throw new Error(`Failed to delete test cases from S3: ${error.message}`);
    }
}; 