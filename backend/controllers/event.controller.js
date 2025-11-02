import Event from '../models/event.model.js';
import cloudinary from '../lib/cloudinary.js';

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, image, isComingSoon } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Upload image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, { folder: 'events' });

    const event = new Event({
      title,
      description,
      date: date || Date.now(), 
      time,
      location,
      image: uploadRes.secure_url,
      isComingSoon: isComingSoon || false,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Event By ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, image, isComingSoon } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // If new image is uploaded, replace old one in Cloudinary
    if (image && image !== event.image) {
      // Delete old image from Cloudinary
      if (event.image) {
        const publicId = event.image.split('/').slice(-2).join('/').split('.')[0];
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log('Error deleting old image:', err);
        }
      }
      
      const uploadRes = await cloudinary.uploader.upload(image, { folder: 'events' });
      event.image = uploadRes.secure_url;
    }

    event.title = title || event.title;
    event.description = description !== undefined ? description : event.description;
    event.date = date !== undefined ? date : event.date;
    event.time = time !== undefined ? time : event.time;
    event.location = location !== undefined ? location : event.location;
    event.isComingSoon = isComingSoon !== undefined ? isComingSoon : event.isComingSoon;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.image) {
      const publicId = event.image.split('/').slice(-2).join('/').split('.')[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log('Error deleting image:', err);
      }
    }
    
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};