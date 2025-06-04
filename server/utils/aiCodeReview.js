import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}); // apiKEY mention else error?

export const aiCodeReview = async (code) => {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
            Analyse the goal of the code.
            Check for any syntax error or other issue.(Mention if any)
            Mention the inefficiencies in the code.
            Explain the intuition behind the optimal code if exists and provide the optimal code.
            Code:${code}
        `,
      });
    return response.text;
};

