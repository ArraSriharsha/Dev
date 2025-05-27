import express from 'express';
import { uploadProblem } from '../controllers/uploadProblems.js';
import uploadfile from '../middleware/middleupload.js';
const router = express.Router();

router.post('/', uploadfile.fields([
    { name: 'inputFile', maxCount: 1 },
    { name: 'outputFile', maxCount: 1 }
]), uploadProblem);

export default router;