import fs from 'fs';  //filesystem
import path from 'path';  //path of anyfile
import { v4 as uuid } from 'uuid';

const currentDir = process.cwd();
const rootDir = path.join(path.dirname(currentDir),'eval');
if(!fs.existsSync(rootDir)){
  fs.mkdirSync(rootDir, { recursive: true });
}
const dirPath = path.join(rootDir, 'codes');

// const __filename = fileURLToPath(import.meta.url); //gives the path of current file /Users/harsha/Desktop/OJ/server/utils/generateFile.js

// const __dirname = path.dirname(__filename); //gives the path of current directory  /Users/harsha/Desktop/OJ/server/utils

// const dirPath = path.join(__dirname, 'codes'); // /Users/harsha/Desktop/OJ/server/utils/codes
// //path of codes directory(on joining to current directory)
if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); //creating codes directory if it doesn't exist (recursive: true means it will create all the directories in the path)
}

export const generateFile = async (language, code) => {
  const jobId = uuid(); //gives a unique id for each file
  const filename = `${jobId}.${language}`; //filename with jobId and language
  const filepath = path.join(dirPath, filename); //path of file(inside codes directory ) with filename
  fs.writeFileSync(filepath, code); //writing code to file
  return filepath;
}

