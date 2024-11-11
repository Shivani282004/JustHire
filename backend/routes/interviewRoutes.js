import express from 'express';
const router = express.Router();
// interviewRoutes.js
import { createInterview, getAllInterviews, getInterviewById, updateInterview, deleteInterview } from '../controllers/interviewController.js';


// Define routes
router.post('/create',createInterview);
router.get('/getAll', getAllInterviews);
router.get('/get/:id', getInterviewById);
router.put('/update/:id', updateInterview);
router.delete('/delete/:id', deleteInterview);

export default router;
