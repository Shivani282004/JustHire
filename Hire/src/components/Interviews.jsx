import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Briefcase, Video, Trash2, Search, Hash } from "lucide-react";
import axios from 'axios';

const Navbar = () => (
  <nav className="bg-[#1a1f2e] p-4 text-white">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex-shrink-0">
        <span className="text-xl font-bold">
          <span className="text-purple-500">Just</span>Hire
        </span>
      </div>
      <div className="space-x-4">
        <Link to="/profile" className="text-purple-500 hover:text-purple-600 mr-7">Profile</Link>
      </div>
    </div>
  </nav>
);

const InterviewCard = ({ interview, onJoin, onDelete, onEvaluate }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg h-[280px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="text-lg font-semibold text-white flex justify-between items-center">
          <span>{interview.role}</span>
          <span className="text-sm font-normal text-purple-500">{interview.status}</span>
        </div>
      </div>

      {/* Content */}
      <div
        className="p-4 flex-1 overflow-y-auto"
        style={{
          overflowY: 'scroll',
          height: '100%',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-purple-500 shrink-0" />
            <span>{new Date(interview.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-purple-500 shrink-0" />
            <span>{new Date(interview.date).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center">
            <Hash className="mr-2 h-4 w-4 text-purple-500 shrink-0" />
            <span>Meeting ID: {interview.meetingId}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-purple-500 shrink-0" />
            <span className="truncate">Candidate: {interview.candidateId.email}</span>
          </div>
          <div className="flex items-start">
            <Briefcase className="mr-2 h-4 w-4 text-purple-500 shrink-0 mt-1" />
            <span className="break-words">
              Experts: {interview.expertIds.map(expert => expert.email).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Footer with buttons - fixed at bottom */}
      {interview.status !== "Completed" && (
        <div className="p-4 border-t border-slate-700 bg-[#1a1f2e] mt-auto flex justify-between items-center">
          {interview.status === "Scheduled" && (
            <button
              onClick={() => onJoin(interview._id)}
              className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
            >
              <Video className="mr-2 h-4 w-4" />
              Join Meeting
            </button>
          )}
          {interview.status === "Pending Evaluation" && (
            <button
              onClick={() => onEvaluate(interview._id)}
              className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
            >
              <User className="mr-2 h-4 w-4" />
              Evaluate
            </button>
          )}
          <button
            onClick={() => onDelete(interview._id)}
            className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md ml-2"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [activeTab, setActiveTab] = useState("Scheduled");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loggedInEmail = localStorage.getItem("loggedInEmail");
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/interviews/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch interviews');
        }
        const data = await response.json();
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInterviews();
  }, [location]);  // Trigger fetch on route changes
  

  const filterInterviews = (status) =>
    interviews
      .filter(interview => interview.status === status)
      .filter(interview => interview.expertIds.some(expert => expert.email === loggedInEmail))
      .filter(interview =>
        interview.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.candidateId.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleJoin = (interviewId) => {
    console.log(`Joining meeting for interview ${interviewId}`);
    navigate('/join-meeting');
  };

  const handleDelete = (interviewId) => {
    console.log(`Deleting interview ${interviewId}`);
    // Add delete functionality here
  };

  
  const handleEvaluate = async (interviewId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/interviews/get/${interviewId}`);
      const interview = response.data;

      // Evaluate questions
      for (let i = 0; i < interview.questions.length; i++) {
        const relevancyPrompt = `On a scale of 1-10, how relevant is this question for the role of ${interview.role}: "${interview.questions[i].questionText} (ignore spelling mistake and be generous while giving marks)". Please respond with only the numeric score.`;
        const relevancyResponse = await axios.post('http://localhost:8000/api/evaluate', { prompt: relevancyPrompt });
        const relevancyScore = relevancyResponse.data.score;

        // Update the question's relevancy score in the database
        await axios.put(`http://localhost:8000/api/interviews/update/${interviewId}`, {
          questions: [{ relevancyScore }],
          updateType: 'updateScore',
          index: i
        });
      }

      // Fetch the updated interview data
      const updatedInterviewResponse = await axios.get(`http://localhost:8000/api/interviews/get/${interviewId}`);
      const updatedInterview = updatedInterviewResponse.data;

      // Evaluate responses
      for (let i = 0; i < updatedInterview.responses.length; i++) {
        const scorePrompt = `On a scale of 1-10, how correct is this answer: "${updatedInterview.responses[i].responseText}" for the question "${updatedInterview.questions[i].questionText} (ignore spelling mistake and be generous while giving marks)". Please respond with only the numeric score.`;
        const scoreResponse = await axios.post('http://localhost:8000/api/evaluate', { prompt: scorePrompt });
        const responseScore = scoreResponse.data.score;

        // Update the response's score in the database
        await axios.put(`http://localhost:8000/api/interviews/update/${interviewId}`, {
          responses: [{ responseScore }],
          updateType: 'updateScore',
          index: i
        });
      }

      // Update the interview status to "Completed"
      const finalUpdatedInterview = await axios.put(`http://localhost:8000/api/interviews/update/${interviewId}`, {
        status: "Completed"
      });

      setInterviews(prevInterviews => 
        prevInterviews.map(interview => 
          interview._id === interviewId ? finalUpdatedInterview.data : interview
        )
      );

      console.log("Evaluation completed");
    } catch (error) {
      console.error("Error during evaluation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0a0d16] text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Interviews</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1a1f2e] border border-slate-700 rounded-lg px-4 py-2 pl-10 w-64 text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {["Scheduled", "Pending Evaluation", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#1a1f2e]'
                }`}
              >
                {tab === "Pending Evaluation" ? "Pending" : tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterInterviews(activeTab).map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                onJoin={handleJoin}
                onDelete={handleDelete}
                onEvaluate={handleEvaluate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}