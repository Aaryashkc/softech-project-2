import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createInterview, deleteInterview, getAllInterviews, getInterviewById, updateInterview } from '../controllers/interview.controller.js';

const router = express.Router();

router.post('/', protectRoute, createInterview);
router.get('/', protectRoute, getAllInterviews);
router.get('/:id', protectRoute, getInterviewById);
router.put('/:id', protectRoute, updateInterview);
router.delete('/:id', protectRoute, deleteInterview);

export default router;
