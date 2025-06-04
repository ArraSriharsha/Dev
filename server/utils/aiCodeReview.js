import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}); // apiKEY mention else error?

export const aiCodeReview = async (code) => {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
        Please review this code for correctness, efficiency, and best practices. First, mention if there is any syntax error or other issue.
         ${code}
        `,
      });
    return response.text;
};

