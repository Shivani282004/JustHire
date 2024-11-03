import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Play } from "lucide-react";
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';

const socket = io("http://localhost:8000");

const Navbar = () => (
  <nav className="bg-[#1a1f2e] p-4 text-white">
    <div className="container mx-auto flex justify-between items-center">
      <span className="text-xl font-bold text-purple-500">JustHire</span>
    </div>
  </nav>
);

export default function WaitingRoom() {
  const [email, setEmail] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [candidateJoined, setCandidateJoined] = useState(false);
  const [loggedInRole, setLoggedInRole] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("loggedInRole");
    const email = localStorage.getItem("loggedInEmail");
    const storedRoomId = localStorage.getItem("roomId");
    
    if (role) setLoggedInRole(role);
    if (email) setLoggedInEmail(email);
    if (storedRoomId) setRoomId(storedRoomId);

    // If expert, join the room immediately
    if (role === "expert" && storedRoomId) {
      socket.emit("join_room", storedRoomId);
    }

    socket.on("candidate_joined", (data) => {
      console.log("Candidate joined event received:", data);
      if (role === "expert") {
        setCandidateJoined(true);
        setRoomId(data.roomId);
        localStorage.setItem("roomId", data.roomId);
        console.log("Candidate has joined:", data);
      }
    });

    socket.on("start_meeting", (data) => {
      console.log("Start meeting event received:", data);
      navigate('/video-call-interface');
    });

    return () => {
      socket.off("candidate_joined");
      socket.off("start_meeting");
    };
  }, [navigate]);

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    const newRoomId = `room_${candidateId}`;
    setRoomId(newRoomId);
    localStorage.setItem("candidateEmail", email);
    localStorage.setItem("candidateId", candidateId);
    localStorage.setItem("roomId", newRoomId);
    
    socket.emit("join_meeting", { email, candidateId, roomId: newRoomId });
    console.log('Joining meeting with:', { email, candidateId, roomId: newRoomId });
    
    // Navigate to waiting room after joining
    navigate('/waiting-room');
  };

  const handleEnterMeeting = () => {
    const expertEmail = localStorage.getItem('loggedInEmail');
    const storedCandidateId = localStorage.getItem('candidateId');
    socket.emit("start_meeting", { expertEmail, candidateId: storedCandidateId, roomId });
  };

  return (
    <div>
      <Navbar />
      <div className="h-screen w-screen bg-[#0a0d16] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-[#242a38] border-gray-700 text-white shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">JustHire Interview Waiting Room</CardTitle>
            <CardDescription className="text-gray-400">
              {loggedInRole === "expert" 
                ? "Waiting for the candidate to join" 
                : "Please enter your details to join the meeting"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            {loggedInRole === "expert" ? (
              <>
                <div className="flex justify-center">
                  <User className="h-32 w-32 text-purple-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{loggedInEmail}</h3>
                  <p className="text-gray-400">Senior Technical Interviewer</p>
                </div>
                {candidateJoined ? (
                  <div className="text-green-500 text-center mt-4 font-medium">
                    Candidate has joined. You may now enter the meeting.
                  </div>
                ) : (
                  <div className="text-yellow-500 text-center mt-4 font-medium">
                    Waiting for candidate to join...
                  </div>
                )}
                <div className="flex justify-center space-x-4 mt-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="bg-purple-500 hover:bg-purple-600 text-white hover:text-white border-purple-500 hover:border-purple-600" 
                    onClick={handleEnterMeeting}
                    disabled={!candidateJoined}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Enter Meeting
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleJoinMeeting}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-[#2a3347] border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="candidateId">Candidate ID</Label>
                    <Input
                      id="candidateId"
                      type="text"
                      placeholder="Enter your Candidate ID"
                      value={candidateId}
                      onChange={(e) => setCandidateId(e.target.value)}
                      required
                      className="bg-[#2a3347] border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Join Meeting
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}