import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/execute.js";
import { generateInputFile } from "../utils/generateInputFile.js";

export const runCode = async (req, res) => {
    const { code, language,input } = req.body;

    if(!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const filepath = await generateFile(language, code);
        const inputfilePath = await generateInputFile(input);
        const output = await executeCpp(filepath,language,inputfilePath);
        res.status(200).json({ filepath, output });
    } catch (error) {
        console.error("Error in running code:", error.message);
        return res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};