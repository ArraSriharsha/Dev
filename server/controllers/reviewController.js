import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.COMPILER_API_KEY });

export const getReviewCode = async (req, res) => {
  const { code, language } = req.body;
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
            Analyse the goal of the code.
            Check for any syntax error or other issue.(Mention if any)
            Mention the inefficiencies in the code.
            Explain the intuition behind the optimal code if exists and provide the optimal code.
            Code:${code}`,
          });

    res.status(200).json(response.text);
  } catch (error) {
    console.error('Review error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};