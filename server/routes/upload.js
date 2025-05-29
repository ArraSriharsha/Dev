import express from 'express';
import { uploadProblem } from '../controllers/uploadProblems.js';
import uploadfile from '../middleware/middleupload.js';
import { protect } from '../middleware/middleauth.js';
const router = express.Router();

router.post('/',protect, uploadfile.fields([
    { name: 'inputFile', maxCount: 1 },
    { name: 'outputFile', maxCount: 1 }
]), uploadProblem);

export default router;