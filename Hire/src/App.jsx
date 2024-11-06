// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LandingPage from "./components/LandingPage"; 
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import AdminDashboard from "./components/AdminDashboard";
import CreateNewUser from './components/CreateNewUser';
import PastInterviews from './components/pastInterviews';
import QuestionBank from './components/questionBank';
import ScheduleInterview from './components/ScheduleInterview';
import AllMeetings from './components/AllMeetings';
import ExpertDashboard from './components/ExpertDashboard';
import Interviews from './components/Interviews';
import JoinMeeting from './components/JoinMeeting';
import Room from  './components/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/create-new-user" element={<CreateNewUser />} />
        <Route path="/past-interviews" element={<PastInterviews />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/schedule-interview" element={<ScheduleInterview />} />
        <Route path="/all-meetings" element={<AllMeetings />} />
        <Route path="/expert-dashboard" element={<ExpertDashboard />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/join-meeting" element={<JoinMeeting />} />
        <Route path="/room/:meetingId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
