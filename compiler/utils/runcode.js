import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Timeout duration in milliseconds (3 seconds)
const EXECUTION_TIMEOUT = 3000;
// Maximum output buffer size (1MB)
const MAX_BUFFER_SIZE = 1024 * 1024;

export const generateFile = async (rootDir,language, code) => {
    const jobId = uuid();
    const filepath = path.join(rootDir, `${jobId}.${language}`);
    await fs.writeFileSync(filepath, code);
    return filepath;
}

export const generateInputFile = async (rootDir,input) => {
    const jobId = uuid();
    const filepath = path.join(rootDir, `${jobId}.txt`);
    await fs.writeFileSync(filepath, input || ''); 
    return filepath;
}

export const executeCode = async (rootDir, filepath, language, inputfilePath, isSubmission = false) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(rootDir, `${jobId}.out`);
    let compileCommand;
    let executeCommand;
    let startTime;
    let startCpuTime;

    switch(language){
        case 'c':
            compileCommand = `gcc ${filepath} -o ${outPath}`;
            executeCommand = inputfilePath ? `${outPath} < ${inputfilePath}` : `${outPath}`;
            break;
        case 'cpp':
            compileCommand = `g++ ${filepath} -o ${outPath}`;
            executeCommand = inputfilePath ? `${outPath} < ${inputfilePath}` : `${outPath}`;
            break;
        case 'py':
            executeCommand = inputfilePath ? 
                `python3 ${filepath} < ${inputfilePath}` :
                `python3 ${filepath}`;
            break;
        case 'js':
            executeCommand = inputfilePath ? 
                `node ${filepath} < ${inputfilePath}` :
                `node ${filepath}`;
            break;
        case 'java':
            executeCommand = inputfilePath ? 
                `java ${filepath} < ${inputfilePath}` :
                `java ${filepath}`;
            break;
        default:
            return { error: 'Invalid language' };
    }

    let child;
    try {
        // For compiled languages, compile first
        if (compileCommand) {
            await execAsync(compileCommand);
        }

        startTime = process.hrtime();
        startCpuTime = process.cpuUsage();
        
        // Create a promise that rejects after timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                if (child) child.kill('SIGKILL');
                reject(new Error(isSubmission ? 'TLE' : 'TIMEOUT'));
            }, EXECUTION_TIMEOUT);
        });

        // Start the process and keep a reference to the child
        const execPromise = new Promise((resolve, reject) => {
            child = exec(executeCommand, { maxBuffer: MAX_BUFFER_SIZE }, (error, stdout, stderr) => {
                if (error) return reject(error);
                resolve({ stdout, stderr });
            });
        });

        // Race between execution and timeout
        const { stdout, stderr } = await Promise.race([
            execPromise,
            timeoutPromise
        ]);

        const endTime = process.hrtime(startTime);
        const endCpuTime = process.cpuUsage(startCpuTime);
        
        // Calculate wall clock time (real time)
        const wallTime = (endTime[0] * 1000 + endTime[1] / 1000000);
        
        // Calculate CPU time (user + system time)
        const cpuTime = (endCpuTime.user + endCpuTime.system) / 1000; // Convert microseconds to milliseconds
        
        // Use the smaller of wall time and CPU time for more accurate measurement
        const runtime = Math.min(wallTime, cpuTime).toFixed(2);

        return { 
            stdout, 
            stderr,
            runtime: `${runtime}ms`
        };
    } catch (error) {
        // Only calculate runtime if we have startTime
        let runtime = '0.00';
        if (startTime && startCpuTime) {
            const endTime = process.hrtime(startTime);
            const endCpuTime = process.cpuUsage(startCpuTime);
            
            // Calculate wall clock time (real time)
            const wallTime = (endTime[0] * 1000 + endTime[1] / 1000000);
            
            // Calculate CPU time (user + system time)
            const cpuTime = (endCpuTime.user + endCpuTime.system) / 1000;
            
            // Use the smaller of wall time and CPU time
            runtime = Math.min(wallTime, cpuTime).toFixed(2);
        }

        // Check for maxBuffer error first
        if (error.message && error.message.includes('maxBuffer')) {
            return {
                error: 'Output Buffer Limit Exceeded',
                ole: true,
                tle: false,
                runtime: `${runtime}ms`
            };
        }
        
        if (error.message === 'TLE') {
            return {
                error: 'Time Limit Exceeded',
                tle: true,
                ole: false,
                runtime: `${runtime}ms`
            };
        } else if (error.message === 'TIMEOUT') {
            return { 
                error: `Execution Timed Out`,
                tle: false,
                ole: false,
                runtime: `${runtime}ms`
            };
        }
        return { 
            error: error.message,
            runtime: `${runtime}ms`
        };
    }
}
