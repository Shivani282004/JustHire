import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Calendar, User, Briefcase, Star } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function PastInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('https://justhire-1.onrender.com/api/interviews/getAll');
        if (!response.ok) {
          toast.error("failed to fetch Interviews");
        }
        const data = await response.json();
        const completedInterviews = data.filter(interview => interview.status === "Completed");
        setInterviews(completedInterviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

 

  return (
    <div className="container mx-auto p-4 bg-[#0a0d16] h-screen w-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Past Interviews</h1>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => (
            <Card key={interview._id} className="bg-[#1a1f2e] border-slate-800 text-white">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{interview.role}</span>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    Completed
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  <div className="flex items-center mt-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(interview.date).toLocaleDateString()}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-purple-400" />
                    <span className="text-sm">Candidate: {interview.candidateId.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-purple-400" />
                    <span className="text-sm">Expert: {interview.expertId.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4 text-yellow-400" />
                    <span className="text-sm">Expert Score: {interview.expertOverallScore.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4 text-yellow-400" />
                    <span className="text-sm">Candidate Score: {interview.candidateOverallScore.toFixed(1)}</span>
                  </div>
                  <p className="text-sm mt-2 text-slate-300">{interview.feedback}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}