import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';
import { promisify } from 'util';

const execAsync = promisify(exec);


export const generateFile = async (language, code) => {
    const jobId = uuid();
    const filepath = path.join(process.cwd(), 'eval', 'run', `${jobId}.${language}`);
    await fs.writeFileSync(filepath, code);
    return filepath;
}

export const generateInputFile = async (input) => {
    const jobId = uuid();
    const filepath = path.join(process.cwd(), 'eval', 'run', `${jobId}.txt`);
    await fs.writeFileSync(filepath, input || ''); 
    return filepath;
}

export const executeCode = async (filepath, language, inputfilePath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(process.cwd(), 'eval', 'run', `${jobId}.out`);
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
            return res.status(400).json({ error: 'Invalid language' });
    }
    try {
        const { stdout, stderr } = await execAsync(command);
        return { stdout, stderr };
    } catch (error) {
        return { error: error.message };
    }
}