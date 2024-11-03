import React, { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SignupComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [signupType, setSignupType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    setIsLoading(true);

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", signupType);

    try {
      const response = await fetch("https://justhire-1.onrender.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: signupType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        toast.success("User registered successfully");
        // You can also add redirection here if needed
      } else {
        console.error("Registration error:", data.message);
        toast.error(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="h-screen w-screen bg-[#0a0d16] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1f2e]/50 backdrop-blur-sm border-slate-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New User</CardTitle>
          <CardDescription className="text-slate-400">Please enter user details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signupType" className="text-sm text-slate-400">
                Enter role
              </Label>
              <Select value={signupType} onValueChange={setSignupType}>
                <SelectTrigger 
                  id="signupType"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0d16] border border-slate-800 rounded-md px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent h-12"
                placeholder="Enter your email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0d16] border border-slate-800 rounded-md px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent h-12"
                placeholder="Create a password"
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
                "Create"
              )}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
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
  );
}