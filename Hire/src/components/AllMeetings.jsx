import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, User, Briefcase } from "lucide-react";
import { Link } from 'react-router-dom';

// Navbar component
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

// InterviewCard component
const InterviewCard = ({ interview, activeTab }) => (
    <Card className="min-w-10 bg-[#1a1f2e] border-slate-700 mb-4 mt-3 w-1/3 mr-5">
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
            <span>Experts: {interview.expertIds.map(expert => expert.email).join(', ')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  

// Main component
export default function AllMeetings() {
    const [interviews, setInterviews] = useState([]);
    const [activeTab, setActiveTab] = useState("Scheduled");
    const [loading, setLoading] = useState(true);
  
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
    }, []);
  
    const filterInterviews = (status) => interviews.filter(interview => interview.status === status);
  
    return (
      <div className="h-screen w-screen bg-[#0a0d16] text-white">
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">All Meetings</h1>
          <Tabs defaultValue="Scheduled" className="space-y-4" onValueChange={(value) => setActiveTab(value)}>
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
                  <InterviewCard key={interview._id} interview={interview} activeTab={activeTab} />
                ))
              )}
            </TabsContent>
            <TabsContent value="Pending Evaluation">
              {loading ? (
                <p>Loading pending interviews...</p>
              ) : (
                filterInterviews("Pending Evaluation").map((interview) => (
                  <InterviewCard key={interview._id} interview={interview} activeTab={activeTab} />
                ))
              )}
            </TabsContent>
            <TabsContent value="Completed">
              {loading ? (
                <p>Loading completed interviews...</p>
              ) : (
                filterInterviews("Completed").map((interview) => (
                  <InterviewCard key={interview._id} interview={interview} activeTab={activeTab} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }
  