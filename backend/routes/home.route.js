import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getHome, updateHome } from '../controllers/home.controller.js';

const router = express.Router();

// Public route - get home data
router.get('/', getHome);

// Protected route - update home data
router.put('/', protectRoute, updateHome);

export default router;

