import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
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

export const getTestCases = async (inputKey, outputKey) => {
    try {
        // Get input file
        const inputCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: inputKey
        });
        const inputResponse = await s3Client.send(inputCommand);
        const inputContent = await inputResponse.Body.transformToString();

        // Get output file
        const outputCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: outputKey
        });
        const outputResponse = await s3Client.send(outputCommand);
        const outputContent = await outputResponse.Body.transformToString();

        return {
            inputContent,
            outputContent
        };
    } catch (error) {
        throw new Error(`Failed to get test cases from S3: ${error.message}`);
    }
};
// Function to get test cases from S3
export const getTestCasesFromS3 = async (inputKey, outputKey) => {
    try {
        const { inputContent, outputContent } = await getTestCases(inputKey, outputKey);

        const testCases = inputContent.split('\n\n').map(tc => tc.trim());
        const expectedOutputs = outputContent.split('\n\n').map(output => output.trim());

        return {
            testCases,
            expectedOutputs
        };
    } catch (error) {
        throw new Error(`Failed to get test cases from S3: ${error.message}`);
    }
};

// Function to compare user output with expected output
export const compareOutputs = (userOutput, expectedOutput) => {
    // Normalize both outputs by trimming whitespace and normalizing line endings
    const normalizedUserOutput = userOutput.trim().replace(/\r\n/g, '\n');
    const normalizedExpectedOutput = expectedOutput.trim().replace(/\r\n/g, '\n');

    return normalizedUserOutput === normalizedExpectedOutput;
};