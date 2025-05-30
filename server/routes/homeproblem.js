import express from 'express';
import { getHomeProblems } from '../controllers/homeproblemController.js';

const router = express.Router();

router.get('/',getHomeProblems);

export default router;