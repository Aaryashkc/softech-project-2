import Interview from '../models/interview.model.js';

// CREATE
export const createInterview = async (req, res) => {
  try {
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).json(interview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Not found" });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateInterview = async (req, res) => {
  try {
    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteInterview = async (req, res) => {
  try {
    const deleted = await Interview.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Interview deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
