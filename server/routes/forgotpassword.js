import express from 'express';
import { sendOTP, resetPassword } from '../controllers/passwordController.js';

const router = express.Router();

router.post('/forgot', sendOTP);
router.post('/reset', resetPassword);

export default router;