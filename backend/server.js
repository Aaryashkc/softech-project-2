import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './lib/mongodb.js';

// routes 
import authRoutes from './routes/auth.route.js';
import eventRoutes from './routes/event.route.js';
import galleryRoutes from './routes/gallery.route.js';
import newsRoutes from './routes/news.route.js';
import interviewRoutes from './routes/interview.route.js';
import contactRoutes from './routes/contact.route.js';

const port= process.env.PORT || 5001;
const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
    origin: ["http://localhost:5173", "https://softech-project-2.vercel.app", "https://ranjittamang.com", "https://www.ranjittamang.com"],
    credentials: true, 
}
))

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/contact', contactRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
})