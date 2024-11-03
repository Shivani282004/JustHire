import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, User, Briefcase, Play, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-[#1a1f2e] p-4 text-white">
    <div className="container mx-auto flex justify-between items-center">
      <span className="text-xl font-bold text-purple-500">JustHire</span>
    </div>
  </nav>
);

const InterviewCard = ({ interview, activeTab }) => {
    const navigate = useNavigate();
  
    return (
      <Card className="bg-[#1a1f2e] border-slate-700 mb-4 mt-3 w-1/3 min-w-0 mr-5">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex justify-between items-center">
            <span>{interview.role}</span>
            <span className="text-sm font-normal text-purple-500">{interview.status}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-purple-500" />
              <span>{new Date(interview.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-purple-500" />
              <span>{new Date(interview.date).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-purple-500" />
              <span>Candidate: {interview.candidateId.email}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4 text-purple-500" />
              <span>Expert: {interview.expertId.email}</span>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            {activeTab === "Scheduled" && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-0 bg-purple-500 hover:bg-purple-600 text-black hover:border-purple-600" 
                  onClick={() => navigate("/waiting-room")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Meeting
                </Button>
                <Button variant="outline" size="sm" className="mr-0 bg-purple-500 hover:bg-purple-600 hover:border-purple-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
            {activeTab === "Pending Evaluation" && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="bg-purple-500 hover:bg-purple-600 hover:border-purple-600">
                  <FileText className="mr-2 h-4 w-4" />
                  Evaluate
                </Button>
                <Button variant="outline" size="sm" className="bg-purple-500 hover:bg-purple-600 hover:border-purple-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
    

export default function AllMeetings() {
  const [interviews, setInterviews] = useState([]);
  const [activeTab, setActiveTab] = useState("Scheduled");
  const [loading, setLoading] = useState(true);
  const loggedInEmail = localStorage.getItem("loggedInEmail");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://justhire-1.onrender.com/api/interviews/getAll');
        if (!response.ok) throw new Error('Failed to fetch interviews');
        const data = await response.json();
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const filterInterviews = (status) =>
    interviews.filter(
      (interview) =>
        (interview.candidateId.email === loggedInEmail || interview.expertId.email === loggedInEmail) &&
        interview.status.trim().toLowerCase() === status.trim().toLowerCase()
    );

  return (
    <div className="h-screen w-screen bg-[#0a0d16] text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Interviews</h1>
        <Tabs defaultValue="scheduled" className="space-y-4" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="bg-[#1a2137] border-gray-700">
            <TabsTrigger value="Scheduled" className="data-[state=active]:bg-purple-600 mr-2">Scheduled</TabsTrigger>
            <TabsTrigger value="Pending Evaluation" className="data-[state=active]:bg-purple-600 mr-2">Pending</TabsTrigger>
            <TabsTrigger value="Completed" className="data-[state=active]:bg-purple-600">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="Scheduled">
            {loading ? (
              <p>Loading scheduled interviews...</p>
            ) : (
              filterInterviews("Scheduled").map((interview) => (
                <InterviewCard key={interview.id} interview={interview} activeTab={activeTab} />
              ))
            )}
          </TabsContent>
          <TabsContent value="Pending Evaluation">
            {loading ? (
              <p>Loading pending interviews...</p>
            ) : (
              filterInterviews("Pending Evaluation").map((interview) => (
                <InterviewCard key={interview.id} interview={interview} activeTab={activeTab} />
              ))
            )}
          </TabsContent>
          <TabsContent value="Completed">
            {loading ? (
              <p>Loading completed interviews...</p>
            ) : (
              filterInterviews("Completed").map((interview) => (
                <InterviewCard key={interview.id} interview={interview} activeTab={activeTab} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
