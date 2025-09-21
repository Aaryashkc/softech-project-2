import cloudinary from '../lib/cloudinary.js';
import Gallery from '../models/gallery.model.js';

// Create gallery
export const createGallery = async (req, res) => {
  try {
    const { title, description, images } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Upload each image to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(async (img) => {
        const uploadRes = await cloudinary.uploader.upload(img, {
          folder: "gallery"
        });
        return {
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id
        };
      })
    );

    const newGallery = new Gallery({
      title,
      description,
      images: uploadedImages
    });

    const saved = await newGallery.save();
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
    const { title, description, images } = req.body;

    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    // Upload new images if provided
    let uploadedImages = gallery.images;
    if (images && images.length > 0) {
      uploadedImages = await Promise.all(
        images.map(async (img) => {
          const uploadRes = await cloudinary.uploader.upload(img, {
            folder: "gallery"
          });
          return {
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id
          };
        })
      );
    }

    gallery.title = title || gallery.title;
    gallery.description = description || gallery.description;
    gallery.images = uploadedImages;

    const updated = await gallery.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete gallery
export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    // Delete images from Cloudinary
    await Promise.all(
      gallery.images.map(img =>
        cloudinary.uploader.destroy(img.public_id)
      )
    );

    await gallery.deleteOne();
    res.status(200).json({ message: 'Gallery deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
