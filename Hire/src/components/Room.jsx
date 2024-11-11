import React, { useState  ,useEffect, useRef} from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import {
  Camera,
  CameraOff,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MoreVertical,
  PhoneOff,
  Settings,
  Users,
  User,
  StopCircle
} from "lucide-react"
import { useWebRTC } from "../hooks/useWebRTC.js"
import axios from "axios"


export default function Component() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true)
  const [message, setMessage] = useState("")
  const { meetingId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const userId = location.state?.userId || 'defaultUserId'
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interview, setInterview] = useState(null);
  const recognitionRef = useRef();
  const [meetingStarted, setMeetingStarted] = useState(false)
  const { 
    participants, 
    streams, 
    toggleMic, 
    toggleCamera, 
    toggleScreenShare, 
    isMicOn, 
    isCameraOn, 
    isScreenSharing,
    messages,
    sendMessage,
    endMeeting
  } = useWebRTC(meetingId, userId)

  const handleEndMeeting = () => {
    endMeeting()
    setMeetingStarted(false)
    navigate('/join-meeting')
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(message)
      setMessage("")
    }
  }

// Add this effect to set up speech recognition
useEffect(() => {
  if ('webkitSpeechRecognition' in window) {
    recognitionRef.current = new webkitSpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + event.results[i][0].transcript + ' ')
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }
    }
  }
}, [])


useEffect(() => {
  axios.get(`http://localhost:8000/api/interviews/getAll`)
    .then(response => {
      const interviewData = response.data.find(item => item.meetingId.toString() === meetingId.toString());
      if (interviewData) setInterview(interviewData);
      else console.error("Interview with specified meetingId not found");
    })
    .catch(error => console.error("Error fetching interviews:", error));
}, [meetingId]);

useEffect(() => {
  // Set meeting as started when more than one participant joins
  if (participants.length > 0) {
    setMeetingStarted(true)
  }

  // Update interview status only if the meeting has started and all participants have left
  if (meetingStarted && participants.length === 0 && interview) {
    axios.put(`http://localhost:8000/api/interviews/update/${interview._id}`, {
      status: 'Pending Evaluation'
    })
      .then(() => {
        console.log("Interview status updated to Pending Evaluation")
        setMeetingStarted(false) // Reset meeting started state
      })
      .catch(error => console.error("Error updating interview status:", error))
  }
}, [participants, interview, meetingStarted])

const toggleRecording = () => {
  if (isRecording) {
    recognitionRef.current.stop();
    
    const loggedInRole = sessionStorage.getItem("loggedInRole");  // Using sessionStorage here
    console.log(loggedInRole)
    const updateData = loggedInRole === "expert"
      ? { questions: [{ questionText: transcript }] }
      : { responses: [{ responseText: transcript }] };
    
    
    // Check if the data is correctly formed before making the request
    console.log("Update data:", updateData);

    if (interview) {
      axios.put(`http://localhost:8000/api/interviews/update/${interview._id}`, updateData)
        .then(response => console.log("Transcript saved"))
        .catch(error => {
          if (error.response && error.response.status === 404) {
            console.error("Endpoint not found: Check if the update route exists");
          } else {
            console.error("Error saving transcript:", error);
          }
        });
    }

    setTranscript("");
  } else {
    recognitionRef.current.start();
  }

  setIsRecording(!isRecording);
};


  return (
    <div className="flex h-screen bg-[#0F1117] overflow-hidden">
      {/* Left Sidebar - Participants */}
      {isParticipantsOpen && (
        <div className="w-80 border-r border-[#2D2F36] bg-[#0F1117] flex flex-col">
          <div className="p-4 border-b border-[#2D2F36]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Participants ({participants.length + 1})
              </h2>
              <button className="p-2 rounded-lg hover:bg-[#1E2028] text-gray-400">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1E2028] flex items-center justify-center">
                  <Users className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">You</p>
                  <p className="text-xs text-gray-400">You</p>
                </div>
              </div>
              {participants.map((participantId) => (
                <div key={participantId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1E2028] flex items-center justify-center">
                    <Users className="h-4 w-4 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{participantId}</p>
                    <p className="text-xs text-gray-400">Participant</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#0F1117] overflow-hidden ">
        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-20 gap-y-20 p-4 py-4 bg-[#0F1117] overflow-auto">
  {Object.entries(streams).map(([participantId, stream]) => (
    <div
      key={participantId}
      className="relative aspect-video bg-[#1E2028] rounded-lg overflow-hidden "
    >
      {(stream.getVideoTracks()[0]?.enabled || (participantId !== userId && isScreenSharing)) ? (
        <video
          ref={(video) => {
            if (video) {
              video.srcObject = stream;
              video.play().catch(error => console.error('Error playing video:', error));
            }
          }}
          autoPlay
          playsInline
          muted={participantId === userId}
          className="w-full h-full object-cover "
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="h-20 w-20 text-gray-600" />
        </div>
      )}
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <span className="text-sm text-white">
            {participantId === userId ? "You" : participantId}
          </span>
        </div>
      </div>
    </div>
  ))}
</div>



        {/* Controls */}
        <div className="h-20 border-t border-[#2D2F36] bg-[#0F1117] flex items-center justify-between px-8">
          <button className="p-2 rounded-full hover:bg-[#1E2028] text-gray-400">
            <Settings className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMic}
              className={`p-4 rounded-full hover:bg-[#1E2028] border border-[#2D2F36] ${isMicOn ? 'text-[#8B5CF6]' : 'text-gray-400'}`}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button 
              onClick={toggleCamera}
              className={`p-4 rounded-full hover:bg-[#1E2028] border border-[#2D2F36] ${isCameraOn ? 'text-[#8B5CF6]' : 'text-gray-400'}`}
            >
              {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
            </button>
            <button 
              onClick={toggleScreenShare}
              className={`p-4 rounded-full hover:bg-[#1E2028] border border-[#2D2F36] ${isScreenSharing ? 'text-[#8B5CF6]' : 'text-gray-400'}`}
            >
              <MonitorUp className="h-5 w-5" />
            </button>
            <button 
              onClick={handleEndMeeting}
              className="p-4 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
           
            <button 
  onClick={toggleRecording}
  className={`p-4 rounded-full hover:bg-[#1E2028] border border-[#2D2F36] ${isRecording ? 'text-[#8B5CF6]' : 'text-gray-400'}`}
>
  {isRecording ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
</button>

{isRecording && (
  <div className="absolute top-4 left-4 right-4 bg-black/50 p-2 rounded">
    <p className="text-white text-sm">{transcript}</p>
  </div>
)}

          </div>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-2 rounded-full hover:bg-[#1E2028] text-gray-400"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Right Sidebar - Chat */}
      {isChatOpen && (
        <div className="w-80 border-l border-[#2D2F36] bg-[#0F1117] flex flex-col">
          <div className="p-4 border-b border-[#2D2F36]">
            <h2 className="text-lg font-semibold text-white">Chat</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1E2028] flex items-center justify-center">
                      <Users className="h-4 w-4 text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{msg.sender === userId ? "You" : msg.sender}</p>
                      <div className="bg-[#1E2028] p-2 rounded-lg mt-1">
                        <p className="text-sm text-gray-200">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-[#2D2F36]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full px-4 py-2 bg-[#1E2028] border-0 text-white placeholder-gray-400 focus:ring-1 focus:ring-[#8B5CF6]"
              />
              <button type="submit" className="p-2 rounded-full bg-[#8B5CF6] text-white hover:bg-[#7C3AED]">
                <MessageSquare className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}