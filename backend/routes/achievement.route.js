import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAchievement, updateAchievement } from '../controllers/achievement.controller.js';

const router = express.Router();

// Public route - get achievement data
router.get('/', getAchievement);

// Protected route - update achievement data
router.put('/', protectRoute, updateAchievement);

export default router;

