import React, { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Component() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        console.log("Attempting login...");
        const response = await fetch("https://justhire-1.onrender.com/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                role: loginType,
            }),
        });

        console.log("Response Status:", response.status);

        // Check if response is not in the range of 200-299
        if (!response.ok) {
            const errorData = await response.json(); // Ensure we capture error response
            console.log("Login failed, showing error toast");
            toast.error(errorData.message || "Login failed.");
            return; // Early return to avoid executing further
        }

        const data = await response.json(); // Only parse JSON if response is OK
        console.log("Response Data:", data);

        const role = data.role; // Assuming the role is returned in the response

        console.log("Login successful, showing success toast");
        localStorage.setItem("loggedInEmail", email);
        localStorage.setItem("loggedInRole", role);

        toast.success('Login was successful!', {
            onClose: () => {
                console.log("Success toast closed, navigating...");
                if (role === 'admin') {
                    navigate('/admin-dashboard');
                } else if (role === 'expert') {
                    navigate('/expert-dashboard');
                } else{
                  navigate('/waiting-room')
                }
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
};



  return (
    <div className="h-screen w-screen bg-[#0a0d16] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1f2e]/50 backdrop-blur-sm border-slate-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400">Please enter your details to login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loginType" className="text-sm text-slate-400">
                Login As
              </Label>
              <Select value={loginType} onValueChange={setLoginType}>
                <SelectTrigger 
                  id="loginType"
                  className="w-full bg-[#0a0d16] border border-slate-800 rounded-md px-4 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent h-12"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0d16] border-slate-800">
                  <SelectItem value="admin" className="text-white">Admin</SelectItem>
                  <SelectItem value="expert" className="text-white">Expert</SelectItem>
                  <SelectItem value="candidate" className="text-white">Candidate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-slate-400">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                className="w-full bg-[#0a0d16] border border-slate-800 rounded-md px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent h-12 font-medium"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-slate-400">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                className="w-full bg-[#0a0d16] border border-slate-800 rounded-md px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent h-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 focus:ring-offset-[#0a0d16] h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="text-center mt-4">
            <a href="#" className="text-purple-500 hover:text-purple-600 text-sm">
              Forgot password?
            </a>
          </div>
        </CardContent>
      </Card>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}