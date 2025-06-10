import problems from '../models/Problems.js';

export const getHomeProblems = async (req, res) => {
    try {
        const homeProblems = await problems.find({}).limit(4).select('-examples -username -constraints -testCasesInputKey -testCasesOutputKey -testCaseCount');
        res.status(200).json(homeProblems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}