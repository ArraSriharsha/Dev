import express from 'express';
import { aiReview } from '../controllers/aiReview.js';

const router = express.Router();

router.post('/', aiReview);

export default router;