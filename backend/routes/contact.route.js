import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getContact, updateContact, sendContactEmail } from '../controllers/contact.controller.js';

const router = express.Router();

// Public routes
router.get('/', getContact);
router.post('/submit', sendContactEmail);

// Protected route - update contact page data
router.put('/', protectRoute, updateContact);

export default router;