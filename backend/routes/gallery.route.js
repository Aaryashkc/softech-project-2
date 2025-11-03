import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createGallery, deleteGallery, getAllGalleries, getGalleryById, updateGallery, uploadSingleMedia } from '../controllers/gallery.controller.js';

const router = express.Router();

router.post('/create', protectRoute, createGallery);
router.post('/upload', protectRoute, uploadSingleMedia);

router.get('/all', getAllGalleries);

// Get gallery by ID
router.get('/:id', getGalleryById);

router.put('/:id', protectRoute, updateGallery);

router.delete('/:id', protectRoute, deleteGallery);

export default router;
