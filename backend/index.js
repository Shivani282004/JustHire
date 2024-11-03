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

dotenv.config({});

const app = express();
const server = http.createServer(app); // Create HTTP server instance
const io = new Server(server, {        // Initialize Socket.IO with CORS options
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

const PORT = process.env.PORT || 5000;

// API routes
app.use("/api/user", userRoute);
app.use('/api/interviews', interviewRoute);
app.use('/api/questionBank', questionbank);

// Socket.IO events for real-time updates
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Listen for candidate joining the meeting
    socket.on("join_meeting", (data) => {
        // Broadcast to all other clients that the candidate has joined
        io.emit("candidate_joined", data);
        console.log("Candidate joined meeting:", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
