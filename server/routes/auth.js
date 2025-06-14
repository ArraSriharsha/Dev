import express from 'express';
import { signup, signin, logout, checkauth } from '../controllers/authController.js';


const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.get('/checkauth', checkauth);

export default router; 