
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Clock, Plus, Calendar as CalendarIcon, Trash, Save, LayoutList } from "lucide-react";
import PlannerSchedule from "@/components/planner/PlannerSchedule";
import ScheduleEditDialog from "@/components/planner/ScheduleEditDialog";
import { format } from "date-fns";
import { getTodosByDate, saveTodosByDate, getSchedulesByDate, saveSchedulesByDate } from "@/services/plannerService";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<"morning" | "afternoon" | "evening" | "midnight" | null>(null);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<ScheduleItem | undefined>(undefined);
  
  // Form state for todo items
  const [newTodo, setNewTodo] = useState<Omit<TodoItem, "id">>({
    activity: "",
    duration: 15, // Default duration in minutes
    notes: "",
  });

  // Load data when date changes
  useEffect(() => {
    const loadedTodos = getTodosByDate(selectedDate);
    const loadedSchedules = getSchedulesByDate(selectedDate);
    
    setTodos(loadedTodos);
    setScheduleItems(loadedSchedules);
  }, [selectedDate]);

  // Save data when it changes
  useEffect(() => {
    saveTodosByDate(selectedDate, todos);
  }, [todos, selectedDate]);

  useEffect(() => {
    saveSchedulesByDate(selectedDate, scheduleItems);
  }, [scheduleItems, selectedDate]);

  const handleTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.activity) {
      toast({
        title: "Error",
        description: "Silakan masukkan nama aktivitas",
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
      title: "Berhasil",
      description: "Aktivitas berhasil ditambahkan",
    });
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Terhapus",
      description: "Aktivitas berhasil dihapus",
    });
  };

  const handleScheduleItemClick = (timeSlot: string, column: "morning" | "afternoon" | "evening" | "midnight", existingItem?: ScheduleItem) => {
    setSelectedTime(timeSlot);
    setSelectedColumn(column);
    setSelectedScheduleItem(existingItem);
    setEditDialogOpen(true);
  };

  const handleScheduleSave = (newItem: Omit<ScheduleItem, "id">) => {
    if (selectedScheduleItem) {
      // Update existing item
      setScheduleItems(
        scheduleItems.map((item) =>
          item.id === selectedScheduleItem.id
            ? { ...newItem, id: selectedScheduleItem.id }
            : item
        )
      );
    } else {
      // Add new item
      setScheduleItems([
        ...scheduleItems,
        {
          id: crypto.randomUUID(),
          ...newItem,
        },
      ]);
    }
  };

  const handleScheduleDelete = () => {
    if (selectedScheduleItem) {
      setScheduleItems(
        scheduleItems.filter((item) => item.id !== selectedScheduleItem.id)
      );
    }
  };

  const handleUseSelectedTodo = (todo: TodoItem) => {
    setNewTodo({
      activity: todo.activity,
      duration: todo.duration,
      notes: todo.notes,
    });
    
    toast({
      description: "Aktivitas dipilih untuk digunakan",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        Daily Planner
      </h1>
      
      {/* ROW 1: Calendar (left), Planning (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Calendar - Left Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {format(selectedDate, "EEEE, d MMMM yyyy")}
            </h2>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border shadow bg-white"
              />
            </div>
            <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Klik pada slot waktu di jadwal untuk menambah atau mengedit aktivitas. Data akan disimpan secara otomatis.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Planning - Right Side */}
        <div className="lg:col-span-8 space-y-6">
          {/* Planning Form */}
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <LayoutList className="h-6 w-6 text-primary" />
              PLANNING
            </h2>
            
            <form onSubmit={handleTodoSubmit} className="space-y-4">
              <div>
                <label htmlFor="activity" className="block text-sm font-medium mb-1">
                  Aktivitas
                </label>
                <Input
                  id="activity"
                  value={newTodo.activity}
                  onChange={(e) => setNewTodo({ ...newTodo, activity: e.target.value })}
                  placeholder="Masukkan nama aktivitas"
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1">
                  Durasi (menit)
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={newTodo.duration}
                  onChange={(e) => setNewTodo({ ...newTodo, duration: parseInt(e.target.value) || 15 })}
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Catatan
                </label>
                <Textarea
                  id="notes"
                  value={newTodo.notes}
                  onChange={(e) => setNewTodo({ ...newTodo, notes: e.target.value })}
                  placeholder="Detail tambahan..."
                  rows={3}
                />
              </div>
              
              <Button type="submit" className="w-full flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Tambah Aktivitas
              </Button>
            </form>
          </div>
          
          {/* Activity List */}
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-xl font-semibold mb-3">Daftar Aktivitas</h3>
            {todos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aktivitas</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todos.map((todo) => (
                      <TableRow key={todo.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="line-clamp-1">{todo.activity}</div>
                          {todo.notes && (
                            <div className="text-xs text-gray-500 line-clamp-1 mt-1">{todo.notes}</div>
                          )}
                        </TableCell>
                        <TableCell>{todo.duration} min</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUseSelectedTodo(todo)}
                              title="Gunakan"
                            >
                              <Save className="h-4 w-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTodo(todo.id)}
                              title="Hapus"
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>Belum ada aktivitas</p>
                <p className="text-xs mt-1">Tambahkan aktivitas di atas</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ROW 2: Schedule (full width) */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            SCHEDULE
          </h2>
          
          <PlannerSchedule 
            onTimeSlotClick={handleScheduleItemClick}
            scheduleItems={scheduleItems}
          />
        </div>
      </div>
      
      {/* Edit Schedule Dialog */}
      <ScheduleEditDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        selectedTime={selectedTime}
        selectedColumn={selectedColumn}
        onSave={handleScheduleSave}
        existingItem={selectedScheduleItem}
        onDelete={handleScheduleDelete}
      />
    </div>
  );
};

export default Planner;
