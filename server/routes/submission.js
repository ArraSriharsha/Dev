import express from 'express';
import { getSubmissions } from '../controllers/getSubmissions.js';
import { protect } from '../middleware/middleauth.js';

const router = express.Router();

router.get('/', protect, getSubmissions);

export default router;