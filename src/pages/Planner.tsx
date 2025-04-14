
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import PlannerSchedule from "@/components/planner/PlannerSchedule";
import ScheduleEditDialog from "@/components/planner/ScheduleEditDialog";
import { format } from "date-fns";
import { getSchedulesByDate, saveSchedulesByDate } from "@/services/plannerService";

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
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<"morning" | "afternoon" | "evening" | "midnight" | null>(null);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<ScheduleItem | undefined>(undefined);

  // Load data when date changes
  useEffect(() => {
    const loadedSchedules = getSchedulesByDate(selectedDate);
    setScheduleItems(loadedSchedules);
  }, [selectedDate]);

  // Save data when it changes
  useEffect(() => {
    saveSchedulesByDate(selectedDate, scheduleItems);
  }, [scheduleItems, selectedDate]);

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

  return (
    <div className="px-4 py-8 max-w-screen-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        Daily Planner
      </h1>
      
      {/* ROW 1: Calendar (left side only) */}
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
          </div>
        </div>
        
        {/* Empty right side */}
        <div className="lg:col-span-8"></div>
      </div>
      
      {/* ROW 2: Schedule (full width) */}
      <div className="mt-8">
        <div className="mb-6">
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
