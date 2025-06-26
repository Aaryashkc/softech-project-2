import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createGallery, deleteGallery, getAllGalleries, getGalleryById, updateGallery } from '../controllers/gallery.controller.js';

const router = express.Router();

// Create gallery (protected)
router.post('/create', protectRoute, createGallery);

// Get all galleries
router.get('/all', getAllGalleries);

// Get gallery by ID
router.get('/:id', getGalleryById);

// Update gallery (protected)
router.put('/:id', protectRoute, updateGallery);

// Delete gallery (protected)
router.delete('/:id', protectRoute, deleteGallery);

export default router;
