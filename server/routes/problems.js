import express from 'express';
import { getProblems } from '../controllers/problemsController.js';
import { protect } from '../middleware/middleauth.js';

const router = express.Router();

// Protected route - requires authentication
router.get('/', protect, getProblems);

export default router;