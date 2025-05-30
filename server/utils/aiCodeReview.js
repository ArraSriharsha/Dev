import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY}); // apiKEY mention else error?

export const aiCodeReview = async (code) => {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
        First, explain the goal of the code in short.
        Then, mention and fix any syntax errors.Mention the inefficiencies in the code.
        Finally, give the complexity of the code and suggest a code(if exists) that has better complexity.
        Make it as short as possible.
        Code: ${code}
        `,
      });
    return response.text;
};

