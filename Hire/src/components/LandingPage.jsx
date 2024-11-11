import React from 'react'
import { ChevronDown, Calendar, Video, FileText, BarChart2, Shield, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 w-full sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold">
                  <span className="text-purple-500">Just</span>Hire
                </span>
              </div>
              <NavigationMenu className="ml-6">
                <NavigationMenuList>
                  {["Home", "Interview", "Performance", "scoring", "Contact"].map((item) => (
                    <NavigationMenuItem key={item}>
                      <NavigationMenuLink className="text-gray-300 hover:text-white px-3 py-2">
                        {item}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex items-center gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700"onClick={() => navigate("/login")}>Login</Button>
            <Button className="bg-purple-600 hover:bg-purple-700"onClick={() => navigate("/signup")}>Signup</Button> 
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-green-400">UNBIASED HIRING,</span>
            <span className="text-gray-400"> BRIGHTER FUTURE</span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Real-Time Hiring
          <br />
          with AI-powered Interviews
        </h1>
        <p className="text-gray-400 text-xl mb-12">
          Our platform delivers an advanced hiring experience
          <br />
          Real-Time, Fair, Impartial Evaluation
        </p>
        <Button className="bg-purple-600 hover:bg-purple-700 mr-4" size="lg" onClick={() => navigate("/report")}>Report</Button> 

        <Button
          className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black"
          size="lg"
        >
          Learn More →
        </Button>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50 w-full">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Cutting-Edge Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Calendar className="h-8 w-8 mb-4 text-purple-500" />, title: "AI-Powered Interview Scheduling", description: "Effortlessly schedule interviews with our smart AI system that considers availability and preferences." },
              { icon: <Video className="h-8 w-8 mb-4 text-purple-500" />, title: "Live Interviews", description: "Conduct seamless live interviews with high-quality video and audio capabilities." },
              { icon: <FileText className="h-8 w-8 mb-4 text-purple-500" />, title: "Comprehensive Question Bank", description: "Access a vast repository of curated questions to ensure thorough candidate assessment." },
              { icon: <BarChart2 className="h-8 w-8 mb-4 text-purple-500" />, title: "Scoring and Evaluation", description: "Utilize our advanced scoring system for fair and consistent candidate evaluation." },
              { icon: <Shield className="h-8 w-8 mb-4 text-purple-500" />, title: "Bias Detection", description: "Employ cutting-edge AI to detect and mitigate unconscious biases in the hiring process." },
              { icon: <PieChart className="h-8 w-8 mb-4 text-purple-500" />, title: "Interview Analytics Dashboard", description: "Gain valuable insights with our comprehensive analytics dashboard." },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-700/50 p-6 rounded-lg hover:bg-gray-700/70 transition-colors">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 w-full bg-gray-900">
  <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center mb-12">How JustHire Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { step: "1", title: "Sign Up", description: "Create your account and set up your organization's profile." },
        { step: "2", title: "Schedule Interviews", description: "Use our AI to efficiently schedule interviews with candidates." },
        { step: "3", title: "Conduct Interviews", description: "Perform live interviews using our advanced video platform." },
        { step: "4", title: "Evaluate & Decide", description: "Utilize our scoring system and analytics to make informed decisions." },
      ].map((step, index) => (
        <div key={index} className="text-center">
          <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold">{step.step}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-gray-300">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-800 to-purple-900 w-full">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of companies using JustHire to find the best talent.</p>
          <Button className="bg-white text-purple-900 hover:bg-gray-100" size="lg">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 JustHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
