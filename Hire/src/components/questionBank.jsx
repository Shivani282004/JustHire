import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Search } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function QuestionBank() {
  const [questionBanks, setQuestionBanks] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const response = await fetch('https://justhire-1.onrender.com/api/questionBank/getAll');
        if (!response.ok) {
          toast.error("Failed to fetch Question Bank");
          return; // Stop further code execution
        }
        const data = await response.json();
        setQuestionBanks(data);
        setFilteredQuestions(data);
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionBanks();
  }, []);

  useEffect(() => {
    const filtered = questionBanks.filter(bank =>
      bank.language.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
  }, [searchTerm, questionBanks]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0a0d16]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-[#0a0d16] h-screen w-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Question Bank</h1>
      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Search by language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#1a1f2e] border-slate-700 text-white"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
      </div>
      <ScrollArea className="h-[calc(100vh-200px)] w-70">
        {filteredQuestions.map((bank, index) => (
          <Card key={index} className="mb-6 bg-[#1a1f2e] border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-500">{bank.language}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {bank.questions.map((question, qIndex) => (
                  <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                    <AccordionTrigger className="text-left pl-10 bg-[#1a1f2e] border-slate-700 text-white hover:no-underline">
                      {qIndex + 1}. {question.questionText}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300">
                      {question.explanation}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
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
