import { aiCodeReview } from '../utils/aiCodeReview.js';
import submission from '../models/Submissions.js';
import problem from '../models/Problems.js';

export const aiReview = async (req, res) => {
    const { code } = req.body;
    const {id}=req.user;
    const {problemId}=req.body;
    if(code==undefined || code.trim()==""){
        return res.status(400).json({message: "Empty Code cannot be Reviewed"});
    }
    try{
        const review = await aiCodeReview(code);
        const title = await problem.findById(problemId).select('title');
        const newSubmission = await submission.create({
            userId: id,
            submissionDate: new Date(),
            status: "pending",
            problemTitle: title.title,
            code: code,
            aiflag: true
        });
        await newSubmission.save();
        res.json(review);
    }catch(error){
        res.status(500).json({message: "Error in Reviewing Code"});
    }
};