import problem from '../models/Problems.js';
import submission from '../models/Submissions.js';
import { evaluateSubmission } from '../utils/submitcode.js';
import path from 'path';
import fs from 'fs';
export const submitCode = async (req, res) => {
    const { problemId, code, language, userId } = req.body;
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
        const processDir = process.cwd();
        const rootDir = path.join(processDir, 'eval');
        if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir, { recursive: true });
        }
        const runDir = path.join(rootDir, 'run');
        if (!fs.existsSync(runDir)) {
            fs.mkdirSync(runDir, { recursive: true });
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
}