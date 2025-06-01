import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const currentDir = process.cwd();
const rootDir = path.join(currentDir,'eval'); 
if(!fs.existsSync(rootDir)){
    fs.mkdirSync(rootDir, { recursive: true });
}
const dirPath = path.join(rootDir, 'inputs');
// const __filename = fileURLToPath(import.meta.url); // current file path
// const __dirname = path.dirname(__filename); // current directory path
// const dirPath = path.join(__dirname, 'inputs'); // inputs directory path
 
if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // creating inputs directory if it doesn't exist
}

export const generateInputFile = async (input) => {
    const jobid = uuid(); // gives a unique id for each file
    const filename = `${jobid}.txt`; // filename with jobid
    const filepath = path.join(dirPath, filename); // input file path
    fs.writeFileSync(filepath, input);
    return filepath;
} 