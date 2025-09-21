import cloudinary from '../lib/cloudinary.js';
import Interview from '../models/interview.model.js';

// CREATE
export const createInterview = async (req, res) => {
  try {
    const { title, excerpt, date, category, platform, featured, link } = req.body;
    let { image } = req.body;

    if (!title || !excerpt || !date || !category || !platform || !link) {
      return res.status(400).json({ message: 'All fields are required except featured' });
    }

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: 'interviews',
      });
      image = uploadedResponse.secure_url;
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newInterview = new Interview({
      title,
      excerpt,
      date,
      category,
      platform,
      featured: featured || false,
      image,
      link,
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in interview creation' });
  }
};

// READ ALL
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in fetching interviews' });
  }
};

// READ ONE
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in fetching interview' });
  }
};

// UPDATE
export const updateInterview = async (req, res) => {
  try {
    const { title, excerpt, date, category, platform, featured, link } = req.body;
    let { image } = req.body;

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (image && image !== interview.image) {
      // delete old image
      const imageId = interview.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`interviews/${imageId}`);

      // upload new image
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: 'interviews',
      });
      image = uploadedResponse.secure_url;
    } else {
      image = interview.image;
    }

    interview.title = title || interview.title;
    interview.excerpt = excerpt || interview.excerpt;
    interview.date = date || interview.date;
    interview.category = category || interview.category;
    interview.platform = platform || interview.platform;
    interview.featured = featured !== undefined ? featured : interview.featured;
    interview.image = image;
    interview.link = link || interview.link;

    await interview.save();
    res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in updating interview' });
  }
};

// DELETE
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.image) {
      const imageId = interview.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`interviews/${imageId}`);
    }

    await Interview.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error in deleting interview' });
  }
};
