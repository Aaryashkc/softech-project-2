import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createArticle, deleteArticle, getAllArticles, getArticleById, updateArticle } from '../controllers/news.controller.js';

const router = express.Router();

router.post('/', protectRoute, createArticle);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

export default router;
