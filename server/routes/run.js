import express from 'express';
import { runCode } from '../controllers/codeController.js';
import { protect } from '../middleware/middleauth.js';
const router = express.Router();

router.post('/', protect,runCode);
router.post('/compiler',runCode);

export default router;