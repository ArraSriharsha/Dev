import express from 'express';
import { getProfile,updateProfile,deleteProfile } from '../controllers/profileContoller.js';
import { protect } from '../middleware/middleauth.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/update', protect, updateProfile);
router.delete('/delete', protect, deleteProfile);

export default router;