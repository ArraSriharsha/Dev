import express from 'express';
import { sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/middleauth.js';
const router = express.Router();

router.post('/', protect, sendMessage);

export default router;