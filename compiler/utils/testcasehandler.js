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
    // Split both outputs into lines
    const userLines = userOutput.split('\n').filter(line => line.trim().length > 0);
    const expectedLines = expectedOutput.split('\n').filter(line => line.trim().length > 0);

    // Compare number of lines
    if (userLines.length !== expectedLines.length) {
        return false;
    }

    // Compare each line
    for (let i = 0; i < userLines.length; i++) {
        // Split each line into tokens
        const userTokens = userLines[i].trim().split(/\s+/);
        const expectedTokens = expectedLines[i].trim().split(/\s+/);

        // Compare number of tokens in each line
        if (userTokens.length !== expectedTokens.length) {
            return false;
        }

        // Compare each token
        for (let j = 0; j < userTokens.length; j++) {
            // Try to parse as number only if it's a pure number
            const userNum = /^-?\d*\.?\d+$/.test(userTokens[j]) ? parseFloat(userTokens[j]) : userTokens[j];
            const expectedNum = /^-?\d*\.?\d+$/.test(expectedTokens[j]) ? parseFloat(expectedTokens[j]) : expectedTokens[j];

            if (userNum !== expectedNum) {
                return false;
            }
        }
    }

    return true;
};