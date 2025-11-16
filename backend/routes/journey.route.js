import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getJourney, updateJourney } from '../controllers/journey.controller.js';

const router = express.Router();

// Public route - get journey data
router.get('/', getJourney);

// Protected route - update journey data
router.put('/', protectRoute, updateJourney);

export default router;

