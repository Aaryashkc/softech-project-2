import Event from '../models/event.model.js';
import cloudinary from '../lib/cloudinary.js';

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Upload image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, { folder: 'events' });

    const event = new Event({
      title,
      date,
      time,
      location,
      description,
      image: uploadRes.secure_url, // save Cloudinary URL
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
    const { title, date, time, location, description, image } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // If new image is uploaded, replace old one in Cloudinary
    if (image) {
      // Optional: delete old image from Cloudinary if you have public_id stored somewhere
      const uploadRes = await cloudinary.uploader.upload(image, { folder: 'events' });
      event.image = uploadRes.secure_url;
    }

    event.title = title || event.title;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.description = description || event.description;

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
        const imageId = event.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(imageId);
        }
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
