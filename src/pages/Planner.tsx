
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Clock, Plus, Calendar as CalendarIcon, Trash } from "lucide-react";
import PlannerSchedule from "@/components/planner/PlannerSchedule";
import { format } from "date-fns";

type TodoItem = {
  id: string;
  activity: string;
  duration: number;
  notes: string;
};

type ScheduleItem = {
  id: string;
  time: string;
  activity: string;
  duration: number;
  notes: string;
  column: "morning" | "afternoon" | "evening" | "midnight";
};

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  
  // Form state for todo items
  const [newTodo, setNewTodo] = useState<Omit<TodoItem, "id">>({
    activity: "",
    duration: 15, // Default duration in minutes
    notes: "",
  });

  useEffect(() => {
    // Here we would typically load data for the selected date
    // For now, we'll just reset the data when the date changes
    setTodos([]);
    setScheduleItems([]);
  }, [selectedDate]);

  const handleTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.activity) {
      toast({
        title: "Error",
        description: "Please enter an activity name",
        variant: "destructive",
      });
      return;
    }

    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      ...newTodo,
    };

    setTodos([...todos, newItem]);
    setNewTodo({
      activity: "",
      duration: 15,
      notes: "",
    });

    toast({
      title: "Success",
      description: "Todo item added successfully",
    });
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Deleted",
      description: "Todo item removed",
    });
  };

  const handleScheduleItemAdd = (timeSlot: string, column: "morning" | "afternoon" | "evening" | "midnight") => {
    // This function will be called when a time slot is clicked
    if (!newTodo.activity) {
      toast({
        title: "Error",
        description: "Please create a todo item first",
        variant: "destructive",
      });
      return;
    }

    const newScheduleItem: ScheduleItem = {
      id: crypto.randomUUID(),
      time: timeSlot,
      activity: newTodo.activity,
      duration: newTodo.duration,
      notes: newTodo.notes,
      column,
    };

    setScheduleItems([...scheduleItems, newScheduleItem]);
    
    toast({
      title: "Scheduled",
      description: `${newTodo.activity} added to ${timeSlot}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Daily Planner</h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-start mb-6">
        <div className="w-full md:w-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border shadow"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">
            Plan for {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h2>
          <p className="text-muted-foreground">
            Schedule your activities for the day by adding them to your todo list and then placing them in the schedule.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PLANNING SECTION (30%) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              PLANNING
            </h2>
            
            <form onSubmit={handleTodoSubmit} className="space-y-4">
              <div>
                <label htmlFor="activity" className="block text-sm font-medium mb-1">
                  Activity
                </label>
                <Input
                  id="activity"
                  value={newTodo.activity}
                  onChange={(e) => setNewTodo({ ...newTodo, activity: e.target.value })}
                  placeholder="Enter activity name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1">
                  Duration (minutes)
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={newTodo.duration}
                  onChange={(e) => setNewTodo({ ...newTodo, duration: parseInt(e.target.value) || 15 })}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  value={newTodo.notes}
                  onChange={(e) => setNewTodo({ ...newTodo, notes: e.target.value })}
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>
              
              <Button type="submit" className="w-full flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add To-Do
              </Button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-xl font-semibold mb-3">To-Do List</h3>
            {todos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todos.map((todo) => (
                      <TableRow key={todo.id}>
                        <TableCell className="font-medium">{todo.activity}</TableCell>
                        <TableCell>{todo.duration} min</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No items added yet
              </div>
            )}
          </div>
        </div>
        
        {/* SCHEDULE SECTION (70%) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              SCHEDULE
            </h2>
            
            <PlannerSchedule 
              onTimeSlotClick={handleScheduleItemAdd}
              scheduleItems={scheduleItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
