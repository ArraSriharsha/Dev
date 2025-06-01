import express from 'express';
import { submitCode } from '../controllers/codeController.js';
import { protect } from '../middleware/middleauth.js';

const router = express.Router();

router.post('/',protect, submitCode);

export default router;