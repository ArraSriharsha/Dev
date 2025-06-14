import express from 'express';
import { sendOTP, verifyOTP, resetPassword } from '../controllers/passwordController.js';
import { protect } from '../middleware/middleauth.js';
const router = express.Router();

router.post('/forgot', sendOTP);
router.post('/verify', verifyOTP);
router.post('/reset', resetPassword);

export default router;