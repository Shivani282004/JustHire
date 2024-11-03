import mongoose from 'mongoose';
const { Schema } = mongoose;

const QuestionBankSchema = new Schema({
  language: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        default: "",
      },
    },
  ],
}, { timestamps: true });

export default mongoose.model('QuestionBank', QuestionBankSchema);
