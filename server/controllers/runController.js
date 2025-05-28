import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/execute.js";
import { generateInputFile } from "../utils/generateInputFile.js";
import { evaluateSubmission } from "../services/compilerService.js";
import submission from "../models/Submissions.js";
import problem from "../models/Problems.js";

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
export const submitCode = async (req, res) => {
    const { problemId, code, language } = req.body;
    const userId = req.user._id;
    const submissionDate = new Date();
    const status = 'pending';
    const score = 0;

    try {
        // Get the problem first to ensure it exists and get its title
        const problemDoc = await problem.findById(problemId);
        if (!problemDoc) {
            return res.status(404).json({ 
                success: false,
                error: 'Problem not found' 
            });
        }

        const newSubmission = new submission({
            userId,
            submissionDate,
            status,
            score,
            problemTitle: problemDoc.title,
            language,
            code
        });
        await newSubmission.save();

        const result = await evaluateSubmission(problemId, code, language, newSubmission._id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in submitting code:", error.message);
        return res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};