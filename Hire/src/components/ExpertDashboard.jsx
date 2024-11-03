
import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, User } from "lucide-react"
import { PlusCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function ExpertDashboard() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://justhire-1.onrender.com/api/interviews/getAll')
      .then(response => response.json())
      .then(data => {
        setInterviews(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching interviews:', error)
        setLoading(false)
      })
  }, [])

  const filterInterviews = (status) => interviews.filter(interview => interview.status === status)

  const InterviewCard = ({ interview }) => (
    <Card className="bg-[#1a2137] border-gray-700 mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{interview.title}</CardTitle>
        <CardDescription className="text-gray-400">{interview.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{interview.candidate}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>{new Date(interview.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>{interview.time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="h-screen w-screen bg-[#0a0d16] text-white flex flex-col">
    {/* Navigation */}
    <nav className="w-full border-b border-slate-800 bg-[#0a0d16] py-4 px-6">
      <div className="flex items-center justify-between">
      <div className="flex-shrink-0">
              <span className="text-xl font-bold">
                <span className="text-purple-500">Just</span>Hire
              </span>
            </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-purple-500 hover:text-purple-600">Home</a>
          <Link  to="/interviews" className="text-purple-500 hover:text-purple-600"> Interviews</Link>
          <Link  className="text-purple-500 hover:text-purple-600">Settings</Link>
          <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200" onClick={() => navigate("/")}>
            logout
          </button>
        </div>
      </div>
    </nav>

    {/* Main Content */}
    <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Welcome back Expert!</h2>
          <p className="text-slate-400 mt-2">Here's an overview of your hiring activities</p>
        </div>

        {/* Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Total Interviews', subtitle: 'Past 30 days', value: '247' },
            { title: 'Active Users', subtitle: 'Currently online', value: '18' },
            { title: 'New Candidates', subtitle: 'This week', value: '52' },
          ].map((metric, index) => (
            <div key={index} className="bg-[#1a1f2e] border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-slate-400">{metric.title}</h3>
              <p className="text-sm text-slate-500">{metric.subtitle}</p>
              <p className="text-4xl font-bold mt-2">{metric.value}</p>
            </div>
          ))}
        </div>
        {/* Recent Activities */}
        <div className="bg-[#1a1f2e] border border-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { icon: User, text: 'Interview scheduled with Shivani for Software Engineer position', time: '2 minutes ago' },
              { icon: Calendar, text: 'Interview scheduled with Shreesha for SDE position', time: '1 hour ago' },
              { icon: User, text: 'Interview scheduled with Veda for Web Developer position', time: '3 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 bg-[#0a0d16] border border-slate-800 rounded-lg p-4">
                <div className="h-10 w-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                  <activity.icon className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
  )
}