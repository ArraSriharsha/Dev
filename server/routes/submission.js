import express from 'express';
import { getSubmissions, allSubmissions } from '../controllers/getSubmissions.js';
import { protect } from '../middleware/middleauth.js';
import { getSubmissionsByProblemByUser } from '../controllers/getSubmissions.js';
import { getSubmissionStatus } from '../controllers/getSubmissions.js';

const router = express.Router();

router.get('/', getSubmissions);
router.get('/status/:submissionId', getSubmissionStatus);
router.get('/all', allSubmissions);
router.get('/problem/:problemTitle',protect, getSubmissionsByProblemByUser);

export default router;