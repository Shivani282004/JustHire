import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import bodyParser from 'body-parser';
import userRoute from "./routes/userRoutes.js";
import interviewRoute from "./routes/interviewRoutes.js";
import questionbank from './routes/questionBankRoute.js';
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message.js';
import { GoogleGenerativeAI } from "@google/generative-ai";


dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5174', 'https://justhirehere.netlify.app'],
    methods: ["GET", "POST"]
  }
});

const corsOptions = {
    origin: ['http://localhost:5174', 'https://justhirehere.netlify.app'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use('/api/interviews', interviewRoute);
app.use('/api/questionBank', questionbank);

const rooms = new Map();



io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('join-room', (roomId, userId) => {
    // Remove user from any previous room
    for (const [roomId, users] of rooms.entries()) {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          rooms.delete(roomId);
        }
        break;
      }
    }

    // Join new room
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    rooms.get(roomId).set(socket.id, userId);
    
    // Emit all users in the room to the newly joined user
    const usersInRoom = Array.from(rooms.get(roomId).values());
    socket.emit('all-users', usersInRoom);

    // Notify other users in the room about the new user
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('user-disconnected', userId);
        }
      }
    });
  });

  socket.on('signal', (to, from, signal) => {
    const roomId = [...rooms.keys()].find(roomId => rooms.get(roomId).has(socket.id));
    if (roomId) {
      const toSocketId = [...rooms.get(roomId).entries()].find(([_, id]) => id === to)?.[0];
      if (toSocketId) {
        io.to(toSocketId).emit('signal', from, signal);
      }
    }
  });

socket.on('chat-message', async (roomId, message) => {
  // Save message to the database
  const newMessage = new Message({
    roomId,
    sender: message.sender,
    content: message.content,
    timestamp: message.timestamp,
  });
  await newMessage.save();

  // Broadcast the message to all users in the room
  io.to(roomId).emit('chat-message', message);
});

socket.on('join-room', async (roomId, userId) => {
  // Fetch previous messages for the room from the database
  const previousMessages = await Message.find({ roomId }).sort({ timestamp: 1 });
  
  // Send previous messages to the newly joined user
  socket.emit('previous-messages', previousMessages);

  // Rest of the join-room logic
});

});


// Initialize Gemini API client with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/evaluate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const score = parseInt(response.match(/\d+/)[0]);
    const validScore = Math.min(Math.max(score, 1), 10);
    
    res.json({ score: validScore });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Error evaluating content" });
  }
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
connectDB();

