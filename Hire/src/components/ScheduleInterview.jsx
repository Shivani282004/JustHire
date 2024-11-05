import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from "lucide-react";

export default function ScheduleInterview() {
  const { control, register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      status: "Scheduled",
      expertIds: [{ id: '' }]
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "expertIds" });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        expertIds: data.expertIds.map(expert => expert.id), // Extract only the IDs
        questions: [{ questionText: data.initialQuestion }],
      };

      const response = await fetch('http://localhost:8000/api/interviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to schedule interview');
      }

      toast.success('Interview scheduled successfully!');
      reset();
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0a0d16] text-white overflow-y-auto py-8 px-4">
      <Card className="max-w-xl mx-auto bg-[#1a1f2e] border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-500">Schedule Interview</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="candidateId" className='text-white'>Candidate ID</Label>
              <Input
                id="candidateId"
                {...register("candidateId", { required: "Candidate ID is required" })}
                className="bg-[#0a0d16] border-slate-700 text-white"
              />
              {errors.candidateId && <p className="text-red-500 text-sm">{errors.candidateId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertIds" className='text-white'>Expert IDs</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input
                    {...register(`expertIds.${index}.id`, { required: "Expert ID is required" })}
                    placeholder="Enter Expert ID"
                    className="bg-[#0a0d16] border-slate-700 text-white"
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ id: '' })}
                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Add Expert
              </Button>
              {errors.expertIds && <p className="text-red-500 text-sm">{errors.expertIds.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingId" className='text-white'>Meeting ID</Label>
              <Input
                id="meetingId"
                type="number"
                {...register("meetingId", { required: "Meeting ID is required", valueAsNumber: true })}
                className="bg-[#0a0d16] border-slate-700 text-white"
              />
              {errors.meetingId && <p className="text-red-500 text-sm">{errors.meetingId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className='text-white'>Interview Date-Time</Label>
              <Input
                id="date"
                type="datetime-local"
                {...register("date", { required: "Date is required" })}
                className="bg-[#0a0d16] border-slate-700 text-white"
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className='text-white'>Role</Label>
              <Input
                id="role"
                {...register("role", { required: "Role is required" })}
                className="bg-[#0a0d16] border-slate-700 text-white"
              />
              {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className='text-white'>Status</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-[#0a0d16] border-slate-700 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1f2e] border-slate-700">
                      <SelectItem value="Scheduled" className="font-medium">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Scheduling...' : 'Schedule Interview'}
            </Button>
          </form>
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
