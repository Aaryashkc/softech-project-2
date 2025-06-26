import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createArticle, deleteArticle, getAllArticles, getArticleById, updateArticle } from '../controllers/news.controller.js';

const router = express.Router();

router.post('/', protectRoute, createArticle);
router.get('/', protectRoute, getAllArticles);
router.get('/:id', protectRoute, getArticleById);
router.put('/:id', protectRoute, updateArticle);
router.delete('/:id', protectRoute, deleteArticle);

export default router;
