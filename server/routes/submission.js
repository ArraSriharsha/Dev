import express from 'express';
import { getSubmissions, allSubmissions } from '../controllers/getSubmissions.js';

const router = express.Router();

router.get('/', getSubmissions);
router.get('/all', allSubmissions);

export default router;