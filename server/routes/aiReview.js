import express from 'express';
import { aiReview } from '../controllers/aiReview.js';
import { protect } from '../middleware/middleauth.js';
const router = express.Router();

router.post('/',protect, aiReview);

export default router;