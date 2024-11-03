import React from 'react';
import { PlusCircle, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
    const navigate=useNavigate();
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
            <Link to="/create-new-user" className="text-purple-500 hover:text-purple-600">Create User</Link>
            <Link to="/past-interviews" className="text-purple-500 hover:text-purple-600">Past Interviews</Link>
            <Link to="/question-bank" className="text-purple-500 hover:text-purple-600">Question Bank</Link>
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
            <h2 className="text-3xl font-bold">Welcome back Admin!</h2>
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

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md" onClick={()=>navigate("/all-meetings")}>
              <PlusCircle className="mr-2 h-5 w-5" />
              New Meeting
            </button>
            <button className="flex items-center border border-purple-500 text-purple-500 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-md" onClick={() => navigate("/schedule-interview")}>
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Interview
            </button>
          </div>

          {/* Recent Activities */}
          <div className="bg-[#1a1f2e] border border-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { icon: User, text: 'New user registered: Shivani', time: '2 minutes ago' },
                { icon: Calendar, text: 'Interview scheduled with Shreesha for Software Engineer position', time: '1 hour ago' },
                { icon: User, text: 'Candidate evaluation completed for Marketing Manager role', time: '3 hours ago' },
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
  );
};

export default AdminDashboard;