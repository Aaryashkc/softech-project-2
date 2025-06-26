import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  platform: { type: String, required: true },
  featured: { type: Boolean, default: false },
  image: { type: String, required: true },
  link: { type: String, required: true }
}, { timestamps: true });

const Interview = mongoose.model('Interview', InterviewSchema);
export default Interview;
