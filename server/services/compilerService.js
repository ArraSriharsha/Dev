import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { Problem } from '../models/Problems.js';
import { compareOutputs } from '../utils/testCaseHandler.js';

const execAsync = promisify(exec);

export const evaluateSubmission = async (problemId, userCode, language) => {
    try {
        // Get problem details including test cases
        const problem = await Problem.findById(problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }

        const results = [];
        let allPassed = true;

        // Create a temporary file for user's code
        const tempDir = path.join(process.cwd(), 'temp');
        await fs.mkdir(tempDir, { recursive: true });
        const userCodePath = path.join(tempDir, `submission_${Date.now()}.${getFileExtension(language)}`);
        await fs.writeFile(userCodePath, userCode);

        // Run each test case
        for (let i = 0; i < problem.testCases.length; i++) {
            const testCase = problem.testCases[i];
            const expectedOutput = problem.expectedOutputs[i];

            try {
                // Create temporary input file for this test case
                const inputPath = path.join(tempDir, `input_${i + 1}.txt`);
                await fs.writeFile(inputPath, testCase);

                // Execute the code with the test case
                const { stdout, stderr } = await executeCode(userCodePath, inputPath, language);

                if (stderr) {
                    results.push({
                        testCaseNumber: i + 1,
                        status: 'RE',
                        message: stderr
                    });
                    allPassed = false;
                    continue;
                }

                // Compare output with expected output
                const isCorrect = compareOutputs(stdout, expectedOutput);
                results.push({
                    testCaseNumber: i + 1,
                    status: isCorrect ? 'AC' : 'WA',
                    message: isCorrect ? 'Accepted' : 'Wrong Answer'
                });

                if (!isCorrect) {
                    allPassed = false;
                }
            } catch (error) {
                results.push({
                    testCaseNumber: i + 1,
                    status: 'RE',
                    message: error.message
                });
                allPassed = false;
            }
        }

        // Cleanup temporary files
        await cleanupTempFiles(tempDir);

        return {
            allPassed,
            results,
            totalTestCases: problem.testCases.length
        };
    } catch (error) {
        throw new Error(`Evaluation failed: ${error.message}`);
    }
};

const getFileExtension = (language) => {
    const extensions = {
        'cpp': 'cpp',
        'python': 'py',
        'java': 'java',
        'javascript': 'js'
    };
    return extensions[language.toLowerCase()] || 'txt';
};

const executeCode = async (codePath, inputPath, language) => {
    const commands = {
        'cpp': `g++ ${codePath} -o ${codePath}.out && ${codePath}.out < ${inputPath}`,
        'python': `python3 ${codePath} < ${inputPath}`,
        'java': `javac ${codePath} && java ${codePath.replace('.java', '')} < ${inputPath}`,
        'javascript': `node ${codePath} < ${inputPath}`
    };

    const command = commands[language.toLowerCase()];
    if (!command) {
        throw new Error('Unsupported language');
    }

    return execAsync(command);
};

const cleanupTempFiles = async (tempDir) => {
    try {
        const files = await fs.readdir(tempDir);
        await Promise.all(files.map(file => fs.unlink(path.join(tempDir, file))));
        await fs.rmdir(tempDir);
    } catch (error) {
        console.error('Error cleaning up temporary files:', error);
    }
}; 