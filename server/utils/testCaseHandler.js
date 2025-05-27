import fs from 'fs/promises';
import path from 'path';

// Function to validate test cases during problem creation
export const validateTestCases = async (inputFilePath, outputFilePath) => {
    try {
        // Read and validate input file
        const inputContent = await fs.readFile(inputFilePath, 'utf-8');
        const testCases = inputContent.split('\n\n').map(tc => tc.trim());
        
        // Read and validate output file
        const outputContent = await fs.readFile(outputFilePath, 'utf-8');
        const expectedOutputs = outputContent.split('\n\n').map(output => output.trim());

        // Validate number of test cases
        if (testCases.length !== expectedOutputs.length) {
            throw new Error('Number of test cases does not match number of expected outputs');
        }

        // Validate each test case and its corresponding output
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const expectedOutput = expectedOutputs[i];

            // Only validate that expected output is not empty
            // Input can be empty/null as it's a valid test case
            if (!expectedOutput) {
                throw new Error(`Expected output ${i + 1} is empty`);
            }
        }

        return testCases.length;
    } catch (error) {
        throw new Error(`Test case validation failed: ${error.message}`);
    }
};

// Function to compare user output with expected output
export const compareOutputs = (userOutput, expectedOutput) => {
    // Normalize both outputs by trimming whitespace and normalizing line endings
    const normalizedUserOutput = userOutput.trim().replace(/\r\n/g, '\n');
    const normalizedExpectedOutput = expectedOutput.trim().replace(/\r\n/g, '\n');
    
    return normalizedUserOutput === normalizedExpectedOutput;
}; 