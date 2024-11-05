import { useState } from "react"
import {
  Camera,
  MessageSquare,
  Mic,
  MonitorUp,
  MoreVertical,
  PhoneOff,
  Settings,
  Users,
} from "lucide-react"

export default function VideoCall() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true)

  return (
    <div className="flex h-screen bg-[#0F1117]">
      {/* Left Sidebar - Participants */}
      {isParticipantsOpen && (
        <div className="w-80 border-r border-[#2D2F36]">
          <div className="p-4 border-b border-[#2D2F36]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Participants (4)
              </h2>
              <button className="p-2 rounded-lg hover:bg-[#1E2028] text-gray-400">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="h-[calc(100vh-5rem)] overflow-auto">
            <div className="p-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1E2028] flex items-center justify-center">
                    <Users className="h-4 w-4 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {i === 0 ? "You" : `Interviewer ${i}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {i === 0 ? "Candidate" : "Interviewer"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4 bg-[#0F1117]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-video bg-[#1E2028] rounded-lg overflow-hidden"
            >
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-1">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span className="text-sm text-white">
                    {i === 0 ? "You" : `Interviewer ${i}`}
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
            <button className="p-4 rounded-full hover:bg-[#1E2028] border border-[#2D2F36] text-gray-400">
              <Mic className="h-5 w-5" />
            </button>
            <button className="p-4 rounded-full hover:bg-[#1E2028] border border-[#2D2F36] text-gray-400">
              <Camera className="h-5 w-5" />
            </button>
            <button className="p-4 rounded-full hover:bg-[#1E2028] border border-[#2D2F36] text-gray-400">
              <MonitorUp className="h-5 w-5" />
            </button>
            <button className="p-4 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500">
              <PhoneOff className="h-5 w-5" />
            </button>
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
        <div className="w-80 border-l border-[#2D2F36] bg-[#0F1117]">
          <div className="p-4 border-b border-[#2D2F36]">
            <h2 className="text-lg font-semibold text-white">Chat</h2>
          </div>
          <div className="h-[calc(100vh-10rem)] overflow-auto">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1E2028] flex items-center justify-center">
                    <Users className="h-4 w-4 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Interviewer 1</p>
                    <div className="bg-[#1E2028] p-2 rounded-lg mt-1">
                      <p className="text-sm text-gray-200">
                        Hello! Welcome to the interview. How are you today?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-[#2D2F36]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-full px-4 py-2 bg-[#1E2028] border-0 text-white placeholder-gray-400 focus:ring-1 focus:ring-[#8B5CF6]"
              />
              <button className="p-2 rounded-full bg-[#8B5CF6] text-white hover:bg-[#7C3AED]">
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}