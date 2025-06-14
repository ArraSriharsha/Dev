import express from 'express';
import { getUsers, updateUser, deleteUser, createUser, getLeaderboardUsers } from '../controllers/usersController.js';
import { protect } from '../middleware/middleauth.js';

const router = express.Router();

// All routes are protected and require authentication


// Get all users
router.get('/', getUsers);

router.get('/leaderboard', getLeaderboardUsers);
// Create a new user
router.post('/', protect, createUser);

// Update a user
router.put('/:userId', protect, updateUser);

// Delete a user
router.delete('/:userId', protect, deleteUser);

export default router; 