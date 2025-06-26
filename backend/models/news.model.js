import mongoose from 'mongoose';

const NewsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  image: { type: String, required: true },
  source: { type: String, required: true },
  link: { type: String, required: true }
}, { timestamps: true });

const NewsArticle = mongoose.model('NewsArticle', NewsArticleSchema);
export default NewsArticle;
