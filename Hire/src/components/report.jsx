import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Report() {
  const [interviewId, setInterviewId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (interviewId) {
      navigate(`/interview-report/${interviewId}`);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0a0d16] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-white">
          Interview Report
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-[#1a1f2e] border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Enter Interview ID</CardTitle>
            <CardDescription className="text-slate-400">
              Please enter the interview ID to view the report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="interviewId" className="text-sm font-medium text-slate-200">
                  Interview ID
                </label>
                <Input
                  id="interviewId"
                  name="interviewId"
                  type="text"
                  required
                  value={interviewId}
                  onChange={(e) => setInterviewId(e.target.value)}
                  className="bg-[#0a0d16] border-slate-700 text-white"
                  placeholder="Enter interview ID"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                View Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}