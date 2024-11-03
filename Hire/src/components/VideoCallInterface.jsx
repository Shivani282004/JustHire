import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Video, VideoOff, Mic, MicOff, MessageSquare, Users, MoreVertical, PhoneOff, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

export default function VideoCallInterface() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakingMicOn, setIsSpeakingMicOn] = useState(true);
  const [isQuestionMicOn, setIsQuestionMicOn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isExpert, setIsExpert] = useState(false);
  const userVideoRef = useRef(null);
  const peerVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("loggedInRole");
    setIsExpert(role === "expert");

    const roomId = localStorage.getItem("roomId");
    if (!roomId) {
      console.error("No room ID found");
      return;
    }

    socket.emit("join_room", roomId);

    // WebRTC setup
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // Set up local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        userVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, stream);
        });

        if (isExpert) {
          peerConnectionRef.current.createOffer()
            .then(offer => peerConnectionRef.current.setLocalDescription(offer))
            .then(() => {
              socket.emit("offer", { offer: peerConnectionRef.current.localDescription, roomId });
            });
        }
      })
      .catch(error => {
        console.error("Error accessing media devices.", error);
      });

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice_candidate", { candidate: event.candidate, roomId });
      }
    };

    // Handle incoming tracks
    peerConnectionRef.current.ontrack = event => {
      peerVideoRef.current.srcObject = event.streams[0];
    };

    // Socket event listeners
    socket.on("offer", async ({ offer }) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", { answer, roomId });
    });

    socket.on("answer", ({ answer }) => {
      peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice_candidate", ({ candidate }) => {
      peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("receive_message", (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice_candidate");
      socket.off("receive_message");
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [isExpert]);

  const toggleVideo = () => {
    const videoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(videoTrack.enabled);
  };

  const toggleSpeakingMic = () => {
    const audioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsSpeakingMicOn(audioTrack.enabled);
  };

  const toggleQuestionMic = () => setIsQuestionMicOn(!isQuestionMicOn);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const roomId = localStorage.getItem('roomId');
      const sender = localStorage.getItem('loggedInEmail') || 'You';
      socket.emit('send_message', { roomId, sender, message });
      setMessages(prevMessages => [...prevMessages, { sender, message }]);
      setMessage('');
    }
  };

  const endCall = () => {
    const roomId = localStorage.getItem('roomId');
    socket.emit('leave_room', roomId);
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    navigate('/');
  };

  return (
    <div className="h-screen w-screen bg-[#1a1f2e] flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex relative">
        {/* Peer's video area */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video bg-[#242a38] rounded-lg overflow-hidden">
            <video ref={peerVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
          </div>
        </div>

        {/* User's video area */}
        <div className="absolute bottom-4 right-4 w-64 aspect-video bg-[#242a38] rounded-lg overflow-hidden">
          <video ref={userVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        </div>

        {/* Chat sidebar */}
        {isChatOpen && (
          <div className="w-80 bg-[#242a38] border-l border-gray-700 flex flex-col z-20">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Chat</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start ${msg.sender === 'You' ? 'justify-end' : ''}`}>
                    {msg.sender !== 'You' && (
                      <div className="h-10 w-10 mr-2 flex items-center justify-center bg-gray-200 rounded-full">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <div className={`rounded-lg p-2 text-white text-sm ${msg.sender === 'You' ? 'bg-purple-600' : 'bg-[#2a3347]'}`}>
                      <p className="font-semibold">{msg.sender}</p>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={sendMessage} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-[#2a3347] border-gray-600 text-white"
                />
                <Button type="submit" size="sm" className="ml-2">
                  Send
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="bg-[#242a38] p-4 flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={isVideoOn ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'}
        >
          {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSpeakingMic}
          className={isSpeakingMicOn ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'}
        >
          {isSpeakingMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleQuestionMic}
          className={isQuestionMicOn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
        >
          {isQuestionMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="outline" size="icon" onClick={toggleChat}>
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Users className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="destructive" size="icon" onClick={endCall}>
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}