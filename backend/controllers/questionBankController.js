import QuestionBank from '../models/quesionBank.js'; // Ensure the correct file name here

// Create a new Question Bank entry
export const createQuestionBank = async (req, res) => {
  try {
    const questionBank = new QuestionBank(req.body);
    await questionBank.save();
    res.status(201).json(questionBank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Question Banks
export const getAllQuestionBanks = async (req, res) => {
  try {
    const questionBanks = await QuestionBank.find();
    res.status(200).json(questionBanks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get questions by language
export const getQuestionsByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    const questions = await QuestionBank.find({ language });
    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this language' });
    }
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a question by language and question ID
export const updateQuestion = async (req, res) => {
  try {
    const { language, questionId } = req.params;
    const questionBank = await QuestionBank.findOneAndUpdate(
      { language, "questions._id": questionId },
      { $set: { "questions.$": req.body } },
      { new: true }
    );
    if (!questionBank) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(questionBank);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a question by language and question ID
export const deleteQuestionBank = async (req, res) => {
  try {
    const { language, questionId } = req.params;
    const questionBank = await QuestionBank.findOneAndUpdate(
      { language },
      { $pull: { questions: { _id: questionId } } },
      { new: true }
    );
    if (!questionBank) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
