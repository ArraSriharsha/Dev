import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, 'outputs');

if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}
console.log(outputPath);  // /Users/harsha/Desktop/OJ/server/utils/outputs
// filepath-/Users/harsha/Desktop/OJ/server/utils/codes/ef5e8abf-7625-40a4-8107-dec079e628a6.cpp
export const executeCpp = async (filepath,language) => {
    const jobid = path.basename(filepath).split(".")[0]; //basename gives filename without directory and split gives array of filename and extension
    // jobid-ef5e8abf-7625-40a4-8107-dec079e628a6
    const outPath = path.join(outputPath, `${jobid}.out`);
    // outPath- /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out
    //const command = `g++ ${filepath} -o ${outPath} && ${outPath}`;
    let command;
    switch(language){
        case 'c':
            command = `gcc ${filepath} -o ${outPath} && ${outPath}`;
            break;
        case 'cpp':
            command = `g++ ${filepath} -o ${outPath} && ${outPath}`;
            break;
        case 'py':
            command = `python3 ${filepath}`;
            break;
        case 'js':
            command = `node ${filepath}`;
            break;
        case 'java':
            command = `java ${filepath}`;
            break;
        default:
            return res.status(400).json({ error: 'Invalid language' });
    }
    // command- g++ /Users/harsha/Desktop/OJ/server/utils/codes/ef5e8abf-7625-40a4-8107-dec079e628a6.cpp -o /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out && /Users/harsha/Desktop/OJ/server/utils/outputs/ef5e8abf-7625-40a4-8107-dec079e628a6.out
    return new Promise((resolve, reject) => {
     exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log("error : ",error);
               resolve({error,stderr});
            } else if (stderr) {
                console.log("Warning/Error:", stderr);
                resolve({ 
                    error: true, 
                    message: stderr,
                    type: 'warning'
                });
            } else {
                resolve({ 
                    error: false, 
                    output: stdout.trim(),
                    type: 'success'
                });
            }
        });
    });
};       