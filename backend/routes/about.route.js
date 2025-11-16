import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAbout, updateAbout } from '../controllers/about.controller.js';

const router = express.Router();

// Public route - get about data
router.get('/', getAbout);

// Protected route - update about data
router.put('/', protectRoute, updateAbout);

export default router;

