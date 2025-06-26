import Gallery from '../models/gallery.model.js';

// Create gallery
export const createGallery = async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    const saved = await gallery.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all galleries
export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(galleries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get gallery by ID
export const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });
    res.status(200).json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update gallery
export const updateGallery = async (req, res) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: 'Gallery not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete gallery
export const deleteGallery = async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Gallery not found' });
    res.status(200).json({ message: 'Gallery deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
