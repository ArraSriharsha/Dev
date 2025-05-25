import express from 'express';
import { runCode } from '../controllers/runController.js';

const router = express.Router();

router.post('/', runCode);
export default router;