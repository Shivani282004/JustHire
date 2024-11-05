import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the interview schema
const interviewSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expertIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          default: null,
        },
        relevancyScore: {
          type: Number,
          default: null,
        },
      },
    ],
    responses: [
      {
        responseText: {
          type: String,
          required: true,
        },
        responseScore: {
          type: Number,
          default: null,
        },
      },
    ],
    expertOverallScore: {
      type: Number,
      default: null,
    },
    candidateOverallScore: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Pending Evaluation"],
      default: "Scheduled",
    },
    meetingId: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Interview model
const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
