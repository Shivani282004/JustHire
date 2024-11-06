// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  content: String,
  timestamp: Date,
});

export default mongoose.model('Message', messageSchema);
