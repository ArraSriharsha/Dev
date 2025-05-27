import express from 'express';
import { submitCode } from '../controllers/runController.js';

const router = express.Router();

router.post('/', submitCode);
export default router;