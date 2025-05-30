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
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({message: "No token found"});
        }    
        const submissions = await submission.find();
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};