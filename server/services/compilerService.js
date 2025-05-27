import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import problem from '../models/Problems.js';
import { compareOutputs } from '../utils/testCaseHandler.js';
import { v4 as uuidv4 } from 'uuid';

export const evaluateSubmission = async (problemId, userCode, language) => {
    try {
        // Get problem details including test cases
        const newproblem = await problem.findById(problemId);
        if (!newproblem) {
            throw new Error('Problem not found');
        }

        // Validate test case paths
        if (!newproblem.testCasesInputPath || !newproblem.testCasesOutputPath) {
            throw new Error('Test case files not found for this problem');
        }

        // Check if test case files exist
        if (!fs.existsSync(newproblem.testCasesInputPath) || !fs.existsSync(newproblem.testCasesOutputPath)) {
            throw new Error('Test case files are missing');
        }

        const results = [];
        let allPassed = true;

        // Create a temporary file for user's code
        const processDir = process.cwd();
        const rootDir = path.join(path.dirname(processDir), 'eval');
        if(!fs.existsSync(rootDir)){
            fs.mkdirSync(rootDir, { recursive: true });
        }
        const tempDir = path.join(rootDir, 'submissions'); // inside OJ directory
        if(!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const submissionId = uuidv4();
        const userCodePath = path.join(tempDir, `${submissionId}.${language}`);
        fs.writeFileSync(userCodePath, userCode);
        
        const inputContent = fs.readFileSync(newproblem.testCasesInputPath, 'utf-8');
        const testCases = inputContent.split('\n\n').map(tc => tc.trim());
            
        // Read and validate output file
        const outputContent = fs.readFileSync(newproblem.testCasesOutputPath, 'utf-8');
        const expectedOutputs = outputContent.split('\n\n').map(output => output.trim());
        
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
                    results.push({
                        testCaseNumber: i + 1,
                        status: 'RE',
                        message: result.stderr
                    });
                    allPassed = false;
                    count = i;
                    break;
                }

                // Compare output with expected output
                const isCorrect = compareOutputs(result.stdout, expectedOutput);
                results.push({
                    testCaseNumber: i + 1,
                    status: isCorrect ? 'AC' : 'WA',
                    message: isCorrect ? 'Accepted' : 'Wrong Answer'
                });

                if (!isCorrect) {
                    allPassed = false;
                    count = i;
                    break;
                }
            } catch (error) {
                results.push({
                    testCaseNumber: i + 1,
                    status: 'RE',
                    message: error.message
                });
                allPassed = false;
                count = i;
                break;
            }
            if(allPassed){
                count = i+1;
            }
        }
        // Cleanup temporary files
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
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const jobid = path.basename(filepath).split(".")[0]; //basename gives filename without directory and split gives array of filename and extension
    // jobid-ef5e8abf-7625-40a4-8107-dec079e628a6
    const outPath = path.join(dirPath, `${jobid}.out`);
    // outPath- /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out
    //const command = `g++ ${filepath} -o ${outPath} && ${outPath}`;
    let command;
    switch(language){
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