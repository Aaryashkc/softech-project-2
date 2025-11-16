import About from '../models/about.model.js';
import cloudinary from '../lib/cloudinary.js';

// Get About Page Data (Public - no auth required)
export const getAbout = async (req, res) => {
  try {
    // Since there should only be one About document, we'll get the first one
    let about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({ 
        message: 'About page data not found. Please run seed script: npm run seed:about' 
      });
    }
    
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update About Page Data (Protected - requires auth)
export const updateAbout = async (req, res) => {
  try {
    const { hero, biography, coreValues, vision, philosophy } = req.body;

    let about = await About.findOne();
    
    if (!about) {
      // Create new if doesn't exist
      about = new About({ hero, biography, coreValues, vision, philosophy });
    } else {
      // Update existing
      if (hero) {
        about.hero = { ...about.hero, ...hero };
      }
      
      if (biography) {
        // Handle biography image upload if it's a base64 string
        const biographyUpdate = { ...biography };
        if (biographyUpdate.image && biographyUpdate.image.startsWith('data:image')) {
          // Delete old image if exists
          if (about.biography.image) {
            try {
              const publicId = about.biography.image.split('/').slice(-2).join('/').split('.')[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.log('Error deleting old biography image:', err);
            }
          }
          
          // Upload new image
          const uploadRes = await cloudinary.uploader.upload(biographyUpdate.image, { 
            folder: 'about' 
          });
          biographyUpdate.image = uploadRes.secure_url;
        } else if (!biographyUpdate.image) {
          // Keep existing image if not provided
          biographyUpdate.image = about.biography.image;
        }
        about.biography = { ...about.biography, ...biographyUpdate };
      }
      
      if (coreValues) {
        about.coreValues = { ...about.coreValues, ...coreValues };
      }
      
      if (vision) {
        about.vision = { ...about.vision, ...vision };
      }
      
      if (philosophy) {
        about.philosophy = { ...about.philosophy, ...philosophy };
      }
    }

    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

