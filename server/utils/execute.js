import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const currentDir = process.cwd();
const rootDir = path.join(currentDir,'eval');
if(!fs.existsSync(rootDir)){
    fs.mkdirSync(rootDir, { recursive: true });
}
const outputPath = path.join(rootDir, 'outputs');
// const __filename = fileURLToPath(import.meta.url); // current file path

if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}
// filepath-/Users/harsha/Desktop/OJ/server/utils/codes/ef5e8abf-7625-40a4-8107-dec079e628a6.cpp
export const executeCpp = async (filepath,language,inputfilePath) => {
    const jobid = path.basename(filepath).split(".")[0]; //basename gives filename without directory and split gives array of filename and extension
    // jobid-ef5e8abf-7625-40a4-8107-dec079e628a6
    const outPath = path.join(outputPath, `${jobid}.out`);
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
            return res.status(400).json({ error: 'Invalid language' });
    }
    // command- g++ /Users/harsha/Desktop/OJ/server/utils/codes/ef5e8abf-7625-40a4-8107-dec079e628a6.cpp -o /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out && /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out
    try {
        const { stdout, stderr } = await execAsync(command);
        return { stdout, stderr };
    } catch (error) {
        return { error: error.message };
    }
};       