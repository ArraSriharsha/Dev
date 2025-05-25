import express from 'express';
import { getProfile } from '../controllers/profileContoller.js';
import { protect } from '../middleware/middleauth.js';

const router = express.Router();

router.get('/', protect, getProfile);

export default router;