import Achievement from '../models/achievement.model.js';

// Get Achievement Data (Public - no auth required)
export const getAchievement = async (req, res) => {
  try {
    // Since there should only be one Achievement document, we'll get the first one
    let achievement = await Achievement.findOne();
    
    if (!achievement) {
      return res.status(404).json({ 
        message: 'Achievement data not found. Please run seed script: npm run seed:achievement' 
      });
    }
    
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Achievement Data (Protected - requires auth)
export const updateAchievement = async (req, res) => {
  try {
    const { hero, stats, achievements, mediaRecognition, futureGoals } = req.body;

    let achievement = await Achievement.findOne();
    
    if (!achievement) {
      // Create new if doesn't exist
      achievement = new Achievement({ hero, stats, achievements, mediaRecognition, futureGoals });
    } else {
      // Update existing
      if (hero) {
        achievement.hero = { ...achievement.hero, ...hero };
      }
      
      if (stats) {
        achievement.stats = stats;
      }
      
      if (achievements) {
        achievement.achievements = achievements;
      }
      
      if (mediaRecognition) {
        achievement.mediaRecognition = { ...achievement.mediaRecognition, ...mediaRecognition };
      }
      
      if (futureGoals) {
        achievement.futureGoals = { ...achievement.futureGoals, ...futureGoals };
      }
    }

    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

