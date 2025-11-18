import cloudinary from '../lib/cloudinary.js';
import Gallery from '../models/gallery.model.js';

// Create gallery
export const createGallery = async (req, res) => {
  try {
    const { title, description, images, category } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // If payload already contains uploaded objects, save directly
    const first = images[0];
    let uploadedImages;
    if (typeof first === 'object' && first?.url && first?.public_id) {
      uploadedImages = images;
    } else {
      // Upload each image/video to Cloudinary
      uploadedImages = await Promise.all(
        images.map(async (img, index) => {
          try {
            const uploadRes = await cloudinary.uploader.upload(img, {
              folder: "gallery",
              resource_type: "auto"
            });
            return {
              url: uploadRes.secure_url,
              public_id: uploadRes.public_id
            };
          } catch (uploadError) {
            console.error(`Error uploading file ${index + 1}:`, uploadError);
            throw new Error(`Failed to upload file ${index + 1}: ${uploadError.message || 'Unknown error'}`);
          }
        })
      );
    }

    const normalizedCategory = (typeof category === 'string' && category.trim()) ? category : 'normal';

    const newGallery = new Gallery({
      title,
      description,
      images: uploadedImages,
      category: normalizedCategory
    });

    const saved = await newGallery.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating gallery:', err);
    const errorMessage = err.message || 'Failed to create gallery';
    res.status(400).json({ 
      error: errorMessage,
      message: errorMessage 
    });
  }
};

// Upload a single image/video (base64) and return Cloudinary details
export const uploadSingleMedia = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Image data is required' });

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: 'gallery',
      resource_type: 'auto',
    });

    return res.status(200).json({ url: uploadRes.secure_url, public_id: uploadRes.public_id });
  } catch (err) {
    console.error('Error uploading single media:', err);
    return res.status(400).json({ error: err.message || 'Failed to upload media' });
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
    const { title, description, images, category } = req.body;

    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    // Upload new images/videos if provided
    let uploadedImages = gallery.images;
    if (images && images.length > 0) {
      uploadedImages = await Promise.all(
        images.map(async (img, index) => {
          try {
            const uploadRes = await cloudinary.uploader.upload(img, {
              folder: "gallery",
              resource_type: "auto" // Automatically detect if it's an image or video
            });
            return {
              url: uploadRes.secure_url,
              public_id: uploadRes.public_id
            };
          } catch (uploadError) {
            console.error(`Error uploading file ${index + 1}:`, uploadError);
            throw new Error(`Failed to upload file ${index + 1}: ${uploadError.message || 'Unknown error'}`);
          }
        })
      );
    }

    gallery.title = title || gallery.title;
    gallery.description = description || gallery.description;
    gallery.images = uploadedImages;
    if (category !== undefined) {
      gallery.category = (typeof category === 'string' && category.trim()) ? category : 'normal';
    }

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
