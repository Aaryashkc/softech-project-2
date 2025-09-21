import NewsArticle from '../models/news.model.js';
import cloudinary from '../lib/cloudinary.js'


// Read all
export const getAllArticles = async (req, res) => {
  try {
    const articles = await NewsArticle.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read one
export const getArticleById = async (req, res) => {
  try {
    const article = await NewsArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, excerpt, date, category, featured, image, source, link } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, { folder: "news" });

    const article = new NewsArticle({
      title,
      excerpt,
      date,
      category,
      featured,
      image: uploadRes.secure_url, // save only the URL
      source,
      link
    });

    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update
export const updateArticle = async (req, res) => {
  try {
    const { title, excerpt, date, category, featured, image, source, link } = req.body;

    const article = await NewsArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // If new image uploaded, replace old one in Cloudinary
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, { folder: "news" });
      article.image = uploadRes.secure_url;
    }

    // update other fields
    article.title = title || article.title;
    article.excerpt = excerpt || article.excerpt;
    article.date = date || article.date;
    article.category = category || article.category;
    article.featured = featured !== undefined ? featured : article.featured;
    article.source = source || article.source;
    article.link = link || article.link;

    const updated = await article.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteArticle = async (req, res) => {
  try {
    const deleted = await NewsArticle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Article not found' });

    if (deleted.image) {
      const imageId = deleted.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imageId);
    }
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
