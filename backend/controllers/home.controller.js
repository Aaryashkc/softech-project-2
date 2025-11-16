import Home from '../models/Home.model.js';
import cloudinary from '../lib/cloudinary.js';

// Get Home Data (Public - no auth required)
export const getHome = async (req, res) => {
  try {
    // Get home data from database
    const home = await Home.findOne();
    
    if (!home) {
      return res.status(404).json({ 
        message: 'Home data not found. Please run the seed script: npm run seed:home' 
      });
    }
    
    res.json(home);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Home Data (Protected - requires auth)
export const updateHome = async (req, res) => {
  try {
    const { hero, highlights, initiatives, cta } = req.body;

    let home = await Home.findOne();
    
    if (!home) {
      home = new Home({ hero, highlights, initiatives, cta });
    } else {
      if (hero) {
        // Handle profile image upload if it's a base64 string
        if (hero.profileImage && hero.profileImage.startsWith('data:image')) {
          // Delete old image if exists
          if (home.hero.profileImage) {
            try {
              const publicId = home.hero.profileImage.split('/').slice(-2).join('/').split('.')[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.log('Error deleting old profile image:', err);
            }
          }
          
          // Upload new image
          const uploadRes = await cloudinary.uploader.upload(hero.profileImage, { folder: 'home' });
          hero.profileImage = uploadRes.secure_url;
        }
        
        home.hero = { ...home.hero, ...hero };
      }
      
      if (highlights) {
        home.highlights = { ...home.highlights, ...highlights };
      }
      
      if (initiatives) {
        // Handle initiative images
        if (initiatives.items) {
          for (let i = 0; i < initiatives.items.length; i++) {
            const item = initiatives.items[i];
            if (item.image && item.image.startsWith('data:image')) {
              // Upload new image
              const uploadRes = await cloudinary.uploader.upload(item.image, { folder: 'home/initiatives' });
              item.image = uploadRes.secure_url;
            }
          }
        }
        home.initiatives = { ...home.initiatives, ...initiatives };
      }
      
      if (cta) {
        home.cta = { ...home.cta, ...cta };
      }
    }

    const updatedHome = await home.save();
    res.json(updatedHome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

