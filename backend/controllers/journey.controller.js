import Journey from '../models/journey.model.js';

// Get Journey Data (Public - no auth required)
export const getJourney = async (req, res) => {
  try {
    // Since there should only be one Journey document, we'll get the first one
    let journey = await Journey.findOne();
    
    if (!journey) {
      return res.status(404).json({ 
        message: 'Journey data not found. Please run seed script: npm run seed:journey' 
      });
    }
    
    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Journey Data (Protected - requires auth)
export const updateJourney = async (req, res) => {
  try {
    const { hero, milestones, leadershipPhases, interviewInsights, currentFocus } = req.body;

    let journey = await Journey.findOne();
    
    if (!journey) {
      // Create new if doesn't exist
      journey = new Journey({ hero, milestones, leadershipPhases, interviewInsights, currentFocus });
    } else {
      // Update existing
      if (hero) {
        journey.hero = { ...journey.hero, ...hero };
      }
      
      if (milestones) {
        journey.milestones = { ...journey.milestones, ...milestones };
      }
      
      if (leadershipPhases) {
        journey.leadershipPhases = { ...journey.leadershipPhases, ...leadershipPhases };
      }
      
      if (interviewInsights) {
        journey.interviewInsights = { ...journey.interviewInsights, ...interviewInsights };
      }
      
      if (currentFocus) {
        journey.currentFocus = { ...journey.currentFocus, ...currentFocus };
      }
    }

    const updatedJourney = await journey.save();
    res.json(updatedJourney);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

