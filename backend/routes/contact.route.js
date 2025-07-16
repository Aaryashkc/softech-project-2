import express from 'express';
import { sendContactEmail } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/submit', sendContactEmail)
export default router;