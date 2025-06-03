import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const COMPILER_URL = process.env.COMPILER_SERVICE_URL;

export const runCode = async (req, res) => {
  const { code, language, input } = req.body;
 
  try {
    const response = await axios.post(`${COMPILER_URL}/run`, {
      code,
      language,
      input
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error from compiler service:', error.message);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
};

export const submitCode = async (req, res) => {
  const userId = req.user._id;
  const { problemId, code, language } = req.body;

  try {
    const response = await axios.post(`${COMPILER_URL}/submit`, {
      problemId,
      code,
      language,
      userId
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Submit error:', error.message);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
};
