import fs from 'fs';
import path from 'path';
import problem from '../models/Problems.js';
import submission from '../models/Submissions.js';
import { executeCode, generateFile, generateInputFile } from '../utils/runcode.js';
import { cleanupTempFiles } from '../utils/cleanup.js';
import { getTestCasesFromS3, compareOutputs } from './testcasehandler.js';


export const evaluateSubmission = async (problemId, userCode, language, submissionId, rootDir) => {
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

        let allPassed = true;

        // Create a temporary file for user's code
        const filepath = await generateFile(rootDir,language, userCode);

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
                const testcasePath = await generateInputFile(rootDir,testCase);
                // Execute the code with the test case
                const result = await executeCode(rootDir,filepath, language, testcasePath);

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

        await cleanupTempFiles(rootDir);

        return {
            allPassed,
            totalTestCasesPassed: count,
            totalTestCases: newproblem.testCaseCount
        };

    } catch (error) {
        throw new Error(`Evaluation failed: ${error.message}`);
    }
};