import path from 'path';
import fs from 'fs';
import { generateFile, generateInputFile, executeCode } from '../utils/runcode.js';
import { cleanupTempFiles } from '../utils/cleanup.js';

export const runCode = async (req, res) => { 
    const { code, language, input } = req.body;
    if(!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    try {
        // Create directories for this run
        const processDir = process.cwd();
        const rootDir = path.join(processDir, 'eval');
        if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir, { recursive: true });
        }
        const runDir = path.join(rootDir, 'run');
        if (!fs.existsSync(runDir)) {
            fs.mkdirSync(runDir, { recursive: true });
        }
        
        const filepath = await generateFile(language, code);
        const inputfilePath = await generateInputFile(input);
        const output = await executeCode(filepath, language, inputfilePath);
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