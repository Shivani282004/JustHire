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

export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { questions, responses, status, updateType, index } = req.body;

    let updateData = {};

    if (updateType === 'updateScore') {
      if (questions && questions.length > 0) {
        updateData.$set = { [`questions.${index}.relevancyScore`]: questions[0].relevancyScore };
      } else if (responses && responses.length > 0) {
        updateData.$set = { [`responses.${index}.responseScore`]: responses[0].responseScore };
      }
    } else {
      if (questions) {
        updateData.$push = { ...updateData.$push, questions: { $each: questions } };
      }
      
      if (responses) {
        updateData.$push = { ...updateData.$push, responses: { $each: responses } };
      }
    }
    
    if (status) {
      updateData.$set = { ...updateData.$set, status: status };
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid update data provided" });
    }

    const interview = await Interview.findByIdAndUpdate(id, updateData, { new: true });
    console.log('Updated Interview:', interview);

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ error: "An error occurred while updating the interview" });
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
