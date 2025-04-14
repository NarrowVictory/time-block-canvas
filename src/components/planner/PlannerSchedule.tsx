
import React from "react";
import { cn } from "@/lib/utils";
import { Clock, Plus } from "lucide-react";

type ScheduleItem = {
  id: string;
  time: string;
  activity: string;
  duration: number;
  notes: string;
  column: "morning" | "afternoon" | "evening" | "midnight";
};

type TimeSlotProps = {
  time: string;
  onClick: () => void;
  hasItem?: boolean;
  item?: ScheduleItem;
};

const TimeSlot = ({ time, onClick, hasItem, item }: TimeSlotProps) => {
  return (
    <div
      className={cn(
        "p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors min-h-[120px] flex flex-col justify-between",
        hasItem ? "bg-soft-purple/10" : "bg-white"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">{time}</span>
        {hasItem && (
          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
            {item?.duration}m
          </span>
        )}
      </div>
      {hasItem ? (
        <div className="p-3 rounded-lg bg-white shadow-sm border border-gray-100">
          <div className="text-base font-semibold text-gray-800 line-clamp-2">
            {item?.activity}
          </div>
          {item?.notes && (
            <div className="text-sm text-gray-500 line-clamp-2 mt-2">
              {item.notes}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-400 opacity-50 mt-4">
          <Plus className="mx-auto h-6 w-6" />
          <span className="text-xs block mt-2">Tambah</span>
        </div>
      )}
    </div>
  );
};

type PlannerScheduleProps = {
  onTimeSlotClick: (
    time: string,
    column: "morning" | "afternoon" | "evening" | "midnight",
    existingItem?: ScheduleItem
  ) => void;
  scheduleItems: ScheduleItem[];
};

const PlannerSchedule = ({
  onTimeSlotClick,
  scheduleItems,
}: PlannerScheduleProps) => {
  // Generate time slots for each column
  const generateTimeSlots = (startHour: number, endHour: number) => {
    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };

  const morningSlots = generateTimeSlots(6, 11);
  const afternoonSlots = generateTimeSlots(12, 17);
  const eveningSlots = generateTimeSlots(18, 23);
  const midnightSlots = generateTimeSlots(0, 5);

  const getItemForTimeSlot = (time: string, column: "morning" | "afternoon" | "evening" | "midnight") => {
    return scheduleItems.find(
      (item) => item.time === time && item.column === column
    );
  };

  const renderColumn = (
    title: string, 
    timeRange: string, 
    slots: string[], 
    column: "morning" | "afternoon" | "evening" | "midnight",
    bgColors: { from: string; to: string }
  ) => (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <div 
        className={`bg-gradient-to-r ${bgColors.from} ${bgColors.to} text-white font-bold p-6 text-center flex items-center justify-between`}
      >
        <span className="text-xl">{title}</span>
        <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full">{timeRange}</span>
      </div>
      <div className="h-[700px] overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {slots.map((time) => {
          const item = getItemForTimeSlot(time, column);
          return (
            <TimeSlot
              key={`${column}-${time}`}
              time={time}
              onClick={() => onTimeSlotClick(time, column, item)}
              hasItem={!!item}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
      {renderColumn(
        "Morning", 
        "(06:00–11:45)", 
        morningSlots, 
        "morning", 
        { from: "from-yellow-400", to: "to-orange-300" }
      )}
      {renderColumn(
        "Afternoon", 
        "(12:00–17:45)", 
        afternoonSlots, 
        "afternoon", 
        { from: "from-blue-400", to: "to-sky-300" }
      )}
      {renderColumn(
        "Evening", 
        "(18:00–23:45)", 
        eveningSlots, 
        "evening", 
        { from: "from-purple-400", to: "to-indigo-300" }
      )}
      {renderColumn(
        "Midnight", 
        "(00:00–05:45)", 
        midnightSlots, 
        "midnight", 
        { from: "from-gray-700", to: "to-gray-600" }
      )}
    </div>
  );
};

export default PlannerSchedule;
