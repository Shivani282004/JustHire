import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Video, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";

const JoinMeeting = () => {
  const [inputValues, setInputValues] = useState({
    candidateId: "",
    expertId: "",
    meetingId: ""
  });
  const [loggedInRole, setLoggedInRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("loggedInRole");
    setLoggedInRole(role);
  }, []);

  const handleChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleEnterMeeting = () => {
    console.log("Entered Meeting:", inputValues);
  };

  return (
    <div className="h-screen w-screen bg-[#0a0d16] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1f2e] border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="h-6 w-6 text-purple-500" />
            Enter Meeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role-specific input fields */}
          {loggedInRole === "candidate" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="candidateId">
                Candidate ID
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input 
                  id="candidateId"
                  name="candidateId"
                  placeholder="Enter Candidate ID"
                  value={inputValues.candidateId}
                  onChange={handleChange}
                  className="pl-9 bg-[#0a0d16] border-slate-700 text-white placeholder:text-slate-500 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {loggedInRole === "expert" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="expertId">
                Expert ID
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input 
                  id="expertId"
                  name="expertId"
                  placeholder="Enter Expert ID"
                  value={inputValues.expertId}
                  onChange={handleChange}
                  className="pl-9 bg-[#0a0d16] border-slate-700 text-white placeholder:text-slate-500 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Meeting ID input field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="meetingId">
              Meeting ID
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input 
                id="meetingId"
                name="meetingId"
                placeholder="Enter Meeting ID"
                value={inputValues.meetingId}
                onChange={handleChange}
                className="pl-9 bg-[#0a0d16] border-slate-700 text-white placeholder:text-slate-500 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleEnterMeeting}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-5"
          >
            <Video className="mr-2 h-4 w-4" />
            Enter Meeting
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JoinMeeting;