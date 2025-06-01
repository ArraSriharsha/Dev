import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import problem from '../models/Problems.js';
import { compareOutputs, getTestCasesFromS3 } from '../utils/testCaseHandler.js';
import { v4 as uuidv4 } from 'uuid';
import submission from '../models/Submissions.js';

export const evaluateSubmission = async (problemId, userCode, language, submissionId) => {
    try {
        // Get problem details including test cases
        const newproblem = await problem.findById(problemId);
        if (!newproblem) {
            throw new Error('Problem not found');
        }

        // Validate test case keys
        if (!newproblem.testCasesInputKey || !newproblem.testCasesOutputKey) {
            throw new Error('Test case files not found for this problem');
        }

        const results = [];
        let allPassed = true;

        // Create a temporary file for user's code
        const processDir = process.cwd();
        const rootDir = path.join(processDir, 'eval');// inside OJ directory
        if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir, { recursive: true });
        }
        const tempDir = path.join(rootDir, 'submissions');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const jobId = uuidv4();
        const userCodePath = path.join(tempDir, `${jobId}.${language}`);
        fs.writeFileSync(userCodePath, userCode);

        // Get test cases from S3
        const { testCases, expectedOutputs } = await getTestCasesFromS3(
            newproblem.testCasesInputKey,
            newproblem.testCasesOutputKey
        );

        let count = 0;

        // Run each test case
        for (let i = 0; i < newproblem.testCaseCount; i++) {
            const testCase = testCases[i];
            const expectedOutput = expectedOutputs[i];

            try {
                // Create temporary input file for this test case
                const testcasePath = path.join(tempDir, `input_${i + 1}.txt`);
                fs.writeFileSync(testcasePath, testCase);

                // Execute the code with the test case
                const result = await executeCode(userCodePath, language, testcasePath);

                if (result.error) {
                    allPassed = false;
                    break;
                }

                // Compare output with expected output
                const isCorrect = compareOutputs(result.stdout, expectedOutput);

                if (!isCorrect) {
                    allPassed = false;
                    break;
                }
                count++;
            } catch (error) {
                allPassed = false;
                break;
            }
        }

        // After the for loop
        const subDoc = await submission.findById(submissionId).select('userId problemTitle');
        const { userId, problemTitle } = subDoc;

        const submissionDoc = await submission.findOne({
            userId,
            problemTitle,
            status: 'AC'
        });

        const aiSubmissionDoc = await submission.findOne({
            userId,
            problemTitle,
            aiflag: true
        });

        if (!submissionDoc) {
            if (allPassed) {
                if (aiSubmissionDoc) {
                    await submission.findByIdAndUpdate(submissionId, { status: 'AC', score: 40 });
                } else {
                    await submission.findByIdAndUpdate(submissionId, { status: 'AC', score: 100 });
                }
            } else {
                await submission.findByIdAndUpdate(submissionId, { status: 'WA', score: -25 });
            }
        } else {
            // Already accepted once before, award 0 points
            if (allPassed) {
                await submission.findByIdAndUpdate(submissionId, { status: 'AC', score: 0 });
            } else {
                await submission.findByIdAndUpdate(submissionId, { status: 'WA', score: -25 });
            }
        }

        await cleanupTempFiles(tempDir);

        return {
            allPassed,
            totalTestCasesPassed: count,
            totalTestCases: newproblem.testCaseCount
        };

    } catch (error) {
        throw new Error(`Evaluation failed: ${error.message}`);
    }
};

export const executeCode = async (filepath, language, inputfilePath) => {
    const dirPath = path.dirname(filepath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const jobid = path.basename(filepath).split(".")[0]; //basename gives filename without directory and split gives array of filename and extension
    // jobid-ef5e8abf-7625-40a4-8107-dec079e628a6
    const outPath = path.join(dirPath, `${jobid}.out`);
    // outPath- /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out
    //const command = `g++ ${filepath} -o ${outPath} && ${outPath}`;
    let command;
    switch (language) {
        case 'c':
            command = `gcc ${filepath} -o ${outPath} && ${outPath} < ${inputfilePath}`;
            break;
        case 'cpp':
            command = `g++ ${filepath} -o ${outPath} && ${outPath} < ${inputfilePath}`;
            break;
        case 'py':
            command = `python3 ${filepath} < ${inputfilePath}`;
            break;
        case 'js':
            command = `node ${filepath} < ${inputfilePath}`;
            break;
        case 'java':
            command = `java ${filepath} < ${inputfilePath}`;
            break;
        default:
            throw new Error('Invalid language');
    }
    // command- g++ /Users/harsha/Desktop/OJ/server/utils/codes/ef5e8abf-7625-40a4-8107-dec079e628a6.cpp -o /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out && /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    error: true,
                    stderr: error.message || stderr || 'Unknown error occurred'
                });
            } else if (stderr) {
                resolve({
                    error: true,
                    stderr: stderr
                });
            } else {
                resolve({
                    error: false,
                    stdout: stdout || ''
                });
            }
        });
    });
};

const cleanupTempFiles = async (tempDir) => {
    try {
        const files = await fs.readdirSync(tempDir);
        await Promise.all(files.map(file => fs.unlinkSync(path.join(tempDir, file))));
        await fs.rmdirSync(tempDir);
    } catch (error) {
        console.error('Error cleaning up temporary files:', error);
    }
}; 