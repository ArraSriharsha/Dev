import submission from '../models/Submissions.js';
import jwt from 'jsonwebtoken';
export const getSubmissions = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({message: "No token found"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const id = decoded.userId;
        const submissions = await submission.find({ userId: id });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const allSubmissions = async (req, res) => {
    try {
                // const token = req.cookies.token;
                // if(!token) {
                //     return res.status(401).json({message: "No token found"});
                // }    
        const submissions = await submission.find();
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getSubmissionsByProblemByUser = async (req, res) => {
    try {
        const {id:userId} = req.user;
       
        const { problemTitle } = req.params;
       
        const submissions = await submission.find({ userId:userId, problemTitle:problemTitle });
        
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getSubmissionStatus = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const submissionDoc = await submission.findById(submissionId).select('-score');
        res.status(200).json(submissionDoc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};