import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent } from '../controllers/event.controller.js';

const router = express.Router();

router.post('/create', protectRoute, createEvent);

router.get('/all', getEvents);

router.get('/:id', getEventById);

router.put('/:id', protectRoute, updateEvent);

router.delete('/:id', protectRoute, deleteEvent);

export default router;