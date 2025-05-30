import { aiCodeReview } from '../utils/aiCodeReview.js';

export const aiReview = async (req, res) => {
    const { code } = req.body;
    if(code==undefined || code.trim()==""){
        return res.status(400).json({message: "Empty Code cannot be Reviewed"});
    }
    try{
        const review = await aiCodeReview(code);
        res.json(review);
    }catch(error){
        res.status(500).json({message: "Error in Reviewing Code"});
    }
};