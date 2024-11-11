import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, User, Briefcase, Hash } from "lucide-react";

export default function InterviewReport() {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { interviewId } = useParams();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/interviews/get/${interviewId}`);
        setInterview(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch interview data');
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0d16] w-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0d16] w-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0d16] w-screen">
        <div className="text-white">No interview found</div>
      </div>
    );
  }

  const calculateGrandTotal = () => {
    const totalRelevancyScore = interview.questions.reduce((sum, q) => sum + (q.relevancyScore || 0), 0);
    const totalResponseScore = interview.responses.reduce((sum, r) => sum + (r.responseScore || 0), 0);
    const maxPossibleScore = interview.questions.length * 20; // 10 for relevancy + 10 for response
    return ((totalRelevancyScore + totalResponseScore) / maxPossibleScore * 10).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#0a0d16] text-white p-8 w-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Interview Report</h1>

        <Card className="bg-[#1a1f2e] border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-500" />
                <span className="text-slate-400">Role:</span>
                <span className="text-white">{interview.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-slate-400">Date:</span>
                <span className="text-white">{new Date(interview.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-slate-400">Time:</span>
                <span className="text-white">{new Date(interview.date).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-purple-500" />
                <span className="text-slate-400">Status:</span>
                <span className="text-white">{interview.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="h-[600px] pr-4">
          {interview.questions.map((question, index) => (
            <Card key={index} className="bg-[#1a1f2e] border-slate-700 mb-4">
              <CardHeader>
                <CardTitle className="text-white text-lg">Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Question Text</h4>
                  <p className="text-white">{question.questionText}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Relevancy Score</h4>
                  <p className="text-purple-500 font-bold">{question.relevancyScore || 'N/A'}/10</p>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Response</h4>
                  <p className="text-white">
                    {interview.responses[index] ? interview.responses[index].responseText : 'No response'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Response Score</h4>
                  <p className="text-purple-500 font-bold">
                    {interview.responses[index] ? `${interview.responses[index].responseScore || 'N/A'}/10` : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-[#1a1f2e] border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Overall Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-1">Expert Overall Score</h4>
                <p className="text-purple-500 font-bold">{interview.expertOverallScore || 'Not yet evaluated'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-1">Candidate Overall Score</h4>
                <p className="text-purple-500 font-bold">{interview.candidateOverallScore || 'Not yet evaluated'}</p>
              </div>
              <Separator className="bg-slate-700" />
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-1">Grand Total</h4>
                <p className="text-2xl font-bold text-purple-500">{calculateGrandTotal()}/10</p>
              </div>
            </CardContent>
          </Card>

          {interview.feedback && (
            <Card className="bg-[#1a1f2e] border-slate-700 mt-4">
              <CardHeader>
                <CardTitle className="text-white">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">{interview.feedback}</p>
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}