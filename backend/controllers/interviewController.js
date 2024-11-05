import Interview from '../models/Interview.js';
import User from '../models/User.js';

// Create a new interview
export const createInterview = async (req, res) => {
  try {
    const { candidateId, expertIds } = req.body;

    // Validate that the candidate has the "candidate" role
    const candidate = await User.findOne({ _id: candidateId, role: 'candidate' });
    if (!candidate) {
      return res.status(400).json({ message: "The selected candidate does not have the 'candidate' role" });
    }

    // Validate that each expert in expertIds has the "expert" role
    const experts = await User.find({ _id: { $in: expertIds }, role: 'expert' });
    if (experts.length !== expertIds.length) {
      return res.status(400).json({ message: "One or more selected experts do not have the 'expert' role" });
    }

    // Create and save the interview if all roles are valid
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
    const interviews = await Interview.find()
      .populate('candidateId')
      .populate('expertIds'); // populate expertIds as an array
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single interview by ID
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidateId')
      .populate('expertIds'); // populate expertIds as an array
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
    const { candidateId, expertIds } = req.body;

    // Validate candidate's role if candidateId is provided
    if (candidateId) {
      const candidate = await User.findOne({ _id: candidateId, role: 'candidate' });
      if (!candidate) {
        return res.status(400).json({ message: "The selected candidate does not have the 'candidate' role" });
      }
    }

    // Validate experts' roles if expertIds are provided
    if (expertIds) {
      const experts = await User.find({ _id: { $in: expertIds }, role: 'expert' });
      if (experts.length !== expertIds.length) {
        return res.status(400).json({ message: "One or more selected experts do not have the 'expert' role" });
      }
    }

    // Update the interview if all roles are valid
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
