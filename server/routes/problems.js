import express from 'express';
import { getProblems, getProblemById } from '../controllers/problemsController.js';
import { protect } from '../middleware/middleauth.js';
import { deleteProblem, updateProblem } from '../controllers/uploadProblems.js';
import uploadfile from '../middleware/middleupload.js';
const router = express.Router();

// Public route
router.get('/', getProblems);
// Protected route
router.get('/:id', protect, getProblemById);
router.delete('/:id', protect, deleteProblem);
router.put('/:id', protect, uploadfile.fields([
    { name: 'inputFile', maxCount: 1 },
    { name: 'outputFile', maxCount: 1 }
]), updateProblem);
export default router;