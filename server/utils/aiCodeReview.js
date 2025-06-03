import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}); // apiKEY mention else error?

export const aiCodeReview = async (code) => {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
        review the code.Use clean text.Do not add *'s and make it look messy.Add new lines wherever necessary
         ${code}
        `,
      });
    return response.text;
};

