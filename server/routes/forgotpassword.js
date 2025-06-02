import express from 'express';
import { sendOTP, resetPassword } from '../controllers/passwordController.js';
import { protect } from '../middleware/middleauth.js';
const router = express.Router();

router.post('/forgot', sendOTP);
router.post('/reset', resetPassword);

export default router;