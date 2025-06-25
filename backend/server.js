import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './lib/mongodb.js';

// routes 
import authRoutes from './routes/auth.route.js';
import eventRoutes from './routes/event.route.js';

const port= process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}
))

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
})