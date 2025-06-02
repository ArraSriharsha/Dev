import express from 'express';
import { getReviewCode } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', getReviewCode);

export default router;