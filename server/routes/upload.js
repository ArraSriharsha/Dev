import express from 'express';
import { uploadproblem } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', uploadproblem);

export default router;