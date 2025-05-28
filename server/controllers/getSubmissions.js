import submission from '../models/Submissions.js';

export const getSubmissions = async (req, res) => {
    try {
        const { id } = req.user;
        const submissions = await submission.find({ userId: id });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};