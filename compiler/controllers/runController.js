import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { generateFile, generateInputFile, executeCode } from '../utils/runcode.js';
import { cleanupTempFiles } from '../utils/cleanup.js';

export const runCode = async (req, res) => { 

    const { code, language, input } = req.body;
    if(!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    try {
        // Create directories for this run
        const executionId = uuid();
        const rootDir = path.join(process.cwd(), `${executionId}`);
        if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir, { recursive: true });
        }
        
        const filepath = await generateFile(rootDir,language, code);
        const inputfilePath = await generateInputFile(rootDir,input);
        const output = await executeCode(rootDir,filepath, language, inputfilePath);
        const dir = path.dirname(filepath);
        await cleanupTempFiles(dir);
        res.status(200).json({ success: true, output });
    } catch (error) {
        console.error("Error in running code:", error.message);
        return res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}