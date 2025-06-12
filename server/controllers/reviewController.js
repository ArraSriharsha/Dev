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
Please analyze the following code and provide a detailed review in the following structure:

Code to analyze:
\`\`\`
${code}
\`\`\`

If the code is appropriate, provide a detailed explanation of the code. Else just reply asking to provide the correct code.

# AI Review

## 1. Code Goal

- What problem is it trying to solve?

## 2. Syntax Analysis

- Note any code style issues

## 3. Performance Analysis

- Time Complexity: Use exact format (e.g., O(2^n), O(n^2), O(log n)) - Explain why
- Space Complexity: Use exact format (e.g., O(1), O(n), O(n^2)) - Explain why
- Identify any inefficiencies in the current implementation

## 4. Optimization Opportunities

- Provide the optimized code if applicable

## 5. Alternative Approaches

- Provide implementation details if relevant

Please format your response in markdown for better readability.
IMPORTANT: When showing time/space complexity, use the exact format:
- For exponential: O(2^n) NOT O(2n)
- For polynomial: O(n^2) NOT O(n2)
- For logarithmic: O(log n)
- For linear: O(n)
- For constant: O(1)

Example of correct complexity notation:
## Time Complexity: O(2^n) where n is the size of the input array
## Space Complexity: O(n^2) due to the nested loop structure
        `,
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