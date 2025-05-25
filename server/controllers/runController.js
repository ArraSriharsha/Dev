import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/execute.js";

export const runCode = async (req, res) => {
    const { code, language } = req.body;

    if(!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const filepath = await generateFile(language, code);
        const output = await executeCpp(filepath,language);
        console.log(output);
        res.status(200).json({ filepath, output });
    } catch (error) {
        console.error("Error in running code:", error.message);
        return res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};