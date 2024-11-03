// @ts-nocheck
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import bodyParser from 'body-parser';
import userRoute from "./routes/userRoutes.js";
import interviewRoute from "./routes/interviewRoutes.js";
import questionbank from './routes/questionBankRoute.js'



dotenv.config({});

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json()); 

const corsOptions = {
    origin:'http://localhost:5174',
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;



app.use("/api/user", userRoute);
app.use('/api/interviews', interviewRoute);
app.use('/api/questionBank', questionbank);

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})



// or app.use(express.json());
