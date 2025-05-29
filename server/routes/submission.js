import express from 'express';
import { getSubmissions } from '../controllers/getSubmissions.js';

const router = express.Router();

router.get('/', getSubmissions);

export default router;