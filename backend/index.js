import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./utils/db.js";
import bodyParser from 'body-parser';
import userRoute from "./routes/userRoutes.js";
import interviewRoute from "./routes/interviewRoutes.js";
import questionbank from './routes/questionBankRoute.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {     
    cors: {
        origin: ['http://localhost:5174', 'https://justhirehere.netlify.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
    origin: ['http://localhost:5174', 'https://justhirehere.netlify.app'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// API routes
app.use("/api/user", userRoute);
app.use('/api/interviews', interviewRoute);
app.use('/api/questionBank', questionbank);

// Socket.IO events for real-time updates
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Listen for candidate joining the meeting
    socket.on("join_meeting", (data) => {
        const { email, candidateId, roomId } = data;
        socket.join(roomId);
        console.log(`Candidate ${email} joined room ${roomId}`);
        socket.to(roomId).emit("candidate_joined", { email, candidateId, roomId });
    });

    // Listen for the expert starting the meeting
    socket.on("start_meeting", (data) => {
        const { expertEmail, candidateId, roomId } = data;
        console.log(`Starting meeting in room ${roomId}`);
        io.to(roomId).emit("start_meeting", { expertEmail, candidateId, roomId });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

connectDB();
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
