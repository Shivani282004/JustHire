import Interview from '../models/Interview.js';
import User from '../models/User.js';

// Create a new interview
export const createInterview = async (req, res) => {
    try {
      const { candidateId, expertId } = req.body;
  
      // Check if an interview already exists for the candidate
      const existingInterview = await Interview.findOne({ candidateId });
      if (existingInterview) {
        return res.status(400).json({ message: "An interview already exists for this candidate." });
      }
  
      // Validate that the candidate has the "candidate" role
      const candidate = await User.findOne({ _id: candidateId, role: 'candidate' });
      if (!candidate) {
        return res.status(400).json({ message: "The selected candidate does not have the 'candidate' role" });
      }
  
      // Validate that the expert has the "expert" role
      const expert = await User.findOne({ _id: expertId, role: 'expert' });
      if (!expert) {
        return res.status(400).json({ message: "The selected expert does not have the 'expert' role" });
      }
  
      // Create and save the interview if both roles are valid and no existing interview is found for the candidate
      const interview = new Interview(req.body);
      await interview.save();
      res.status(201).json(interview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all interviews
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate('candidateId').populate('expertId');
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single interview by ID
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('candidateId').populate('expertId');
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an interview by ID
export const updateInterview = async (req, res) => {
  try {
    const { candidateId, expertId } = req.body;

    // Validate candidate's role if candidateId is provided
    if (candidateId) {
      const candidate = await User.findOne({ _id: candidateId, role: 'candidate' });
      if (!candidate) {
        return res.status(400).json({ message: "The selected candidate does not have the 'candidate' role" });
      }
    }

    // Validate expert's role if expertId is provided
    if (expertId) {
      const expert = await User.findOne({ _id: expertId, role: 'expert' });
      if (!expert) {
        return res.status(400).json({ message: "The selected expert does not have the 'expert' role" });
      }
    }

    // Update the interview if both roles are valid
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an interview by ID
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
