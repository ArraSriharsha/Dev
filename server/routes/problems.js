import express from 'express';
import { getProblems, getProblemById } from '../controllers/problemsController.js';
import { protect } from '../middleware/middleauth.js';

const router = express.Router();

// Protected routes - requires authentication
router.get('/', protect, getProblems);
router.get('/:id', protect, getProblemById);

export default router;