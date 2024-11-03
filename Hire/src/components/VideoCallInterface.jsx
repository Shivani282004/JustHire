import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Video, VideoOff, Mic, MicOff, MessageSquare, Users, MoreVertical, PhoneOff, User } from 'lucide-react'
import { useNavigate} from 'react-router-dom';

export default function VideoCallInterface() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isSpeakingMicOn, setIsSpeakingMicOn] = useState(true)
  const [isQuestionMicOn, setIsQuestionMicOn] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate();

  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleSpeakingMic = () => setIsSpeakingMicOn(!isSpeakingMicOn)
  const toggleQuestionMic = () => setIsQuestionMicOn(!isQuestionMicOn)
  const toggleChat = () => setIsChatOpen(!isChatOpen)

  const sendMessage = (e) => {
    e.preventDefault()
    console.log('Sending message:', message)
    setMessage('')
  }

  const endCall = () => {
    navigate('/')
  }

  return (
    <div className="h-screen w-screen bg-[#1a1f2e] flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex relative">
        {/* Other person's video area */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video bg-[#242a38] rounded-lg overflow-hidden">
            <video className="w-full h-full object-cover" autoPlay muted loop>
              <source src="/placeholder-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* User's video area */}
        <div className="absolute bottom-4 right-4 w-64 aspect-video bg-[#242a38] rounded-lg overflow-hidden">
          {isVideoOn ? (
            <video className="w-full h-full object-cover" autoPlay muted>
              <source src="/user-video.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <User className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Chat sidebar */}
        {isChatOpen && (
          <div className="w-80 bg-[#242a38] border-l border-gray-700 flex flex-col z-20">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Chat</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 mr-2 flex items-center justify-center bg-gray-200 rounded-full">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="bg-[#2a3347] rounded-lg p-2 text-white text-sm">
                    <p className="font-semibold">John Doe</p>
                    <p>Hello, how are you?</p>
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="bg-purple-600 rounded-lg p-2 text-white text-sm">
                    <p className="font-semibold">You</p>
                    <p>I'm doing well, thank you!</p>
                  </div>
                </div>
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
  )
}