import cloudinary from '../lib/cloudinary.js';
import Gallery from '../models/gallery.model.js';

const extractYouTubeVideoId = (input) => {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Allow passing just the 11 character video id
  const directIdMatch = trimmed.match(/^[a-zA-Z0-9_-]{11}$/);
  if (directIdMatch) {
    return directIdMatch[0];
  }

  let urlToParse = trimmed;
  if (!/^https?:\/\//i.test(urlToParse)) {
    urlToParse = `https://${urlToParse}`;
  }

  try {
    const url = new URL(urlToParse);
    const host = url.hostname.replace('www.', '');

    if (!['youtube.com', 'youtu.be', 'm.youtube.com'].includes(host)) {
      return null;
    }

    if (host === 'youtu.be') {
      const pathId = url.pathname.replace('/', '').split('/')[0];
      return pathId || null;
    }

    if (url.searchParams.has('v')) {
      return url.searchParams.get('v');
    }

    const pathPatterns = [/^\/embed\/([^/?]+)/, /^\/shorts\/([^/?]+)/, /^\/live\/([^/?]+)/];
    for (const pattern of pathPatterns) {
      const match = url.pathname.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

const normalizeYouTubeUrl = (input) => {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;
  return {
    id: videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`
  };
};

// Create gallery
export const createGallery = async (req, res) => {
  try {
    const { title, description, images, category, youtubeUrl } = req.body;

    const normalizedCategory = (typeof category === 'string' && category.trim()) ? category : 'normal';
    let uploadedImages = [];
    let normalizedYoutubeUrl;

    if (normalizedCategory === 'vlog') {
      const normalized = normalizeYouTubeUrl(youtubeUrl);
      if (!normalized) {
        return res.status(400).json({ error: "A valid YouTube URL is required for vlog entries" });
      }
      normalizedYoutubeUrl = normalized.url;
    } else {
      if (!images || images.length === 0) {
        return res.status(400).json({ error: "At least one image is required" });
      }

      const first = images[0];
      if (typeof first === 'object' && first?.url && first?.public_id) {
        uploadedImages = images;
      } else {
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
    }

    const newGallery = new Gallery({
      title,
      description,
      images: uploadedImages,
      category: normalizedCategory,
      youtubeUrl: normalizedCategory === 'vlog' ? normalizedYoutubeUrl : undefined
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
    const { category } = req.query;
    const filter = {};
    if (typeof category === 'string' && category.trim()) {
      filter.category = category.trim();
    }
    const galleries = await Gallery.find(filter).sort({ createdAt: -1 });
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
    const { title, description, images, category, youtubeUrl } = req.body;

    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    const incomingCategory = (typeof category === 'string' && category.trim()) ? category.trim() : undefined;
    const nextCategory = incomingCategory || gallery.category || 'normal';

    if (nextCategory === 'vlog') {
      const normalized = normalizeYouTubeUrl(youtubeUrl || gallery.youtubeUrl);
      if (!normalized) {
        return res.status(400).json({ error: "A valid YouTube URL is required for vlog entries" });
      }

      if (gallery.images?.length) {
        await Promise.all(
          gallery.images.map(async (img) => {
            try {
              return await cloudinary.uploader.destroy(img.public_id);
            } catch (destroyError) {
              console.error(`Failed to delete Cloudinary asset ${img.public_id}:`, destroyError);
              return null;
            }
          })
        );
      }

      gallery.images = [];
      gallery.youtubeUrl = normalized.url;
    } else {
      let updatedImages = gallery.images;
      if (Array.isArray(images) && images.length > 0) {
        updatedImages = await Promise.all(
          images.map(async (img, index) => {
            if (typeof img === 'object' && img?.url && img?.public_id) {
              return img;
            }
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
      } else if ((!gallery.images || gallery.images.length === 0) && gallery.category === 'vlog') {
        return res.status(400).json({ error: "At least one image is required when converting a vlog into a gallery" });
      }

      gallery.images = updatedImages;
      gallery.youtubeUrl = undefined;
    }

    gallery.title = title || gallery.title;
    gallery.description = description || gallery.description;
    gallery.category = nextCategory;

    const updated = await gallery.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating gallery:', err);
    res.status(400).json({ error: err.message || 'Failed to update gallery' });
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
