
import React from "react";
import { cn } from "@/lib/utils";

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
        "p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors min-h-[50px]",
        hasItem && "bg-primary/10"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{time}</span>
        {hasItem && (
          <span className="text-xs bg-primary text-white px-1 rounded">
            {item?.duration}min
          </span>
        )}
      </div>
      {hasItem && (
        <div className="mt-1">
          <div className="text-sm font-medium">{item?.activity}</div>
          {item?.notes && <div className="text-xs text-gray-500">{item.notes}</div>}
        </div>
      )}
    </div>
  );
};

type PlannerScheduleProps = {
  onTimeSlotClick: (
    time: string,
    column: "morning" | "afternoon" | "evening" | "midnight"
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* MORNING COLUMN */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-300 text-white font-bold p-2 text-center">
          Morning (06:00–11:45)
        </div>
        <div className="h-[500px] overflow-y-auto">
          {morningSlots.map((time) => {
            const item = getItemForTimeSlot(time, "morning");
            return (
              <TimeSlot
                key={`morning-${time}`}
                time={time}
                onClick={() => onTimeSlotClick(time, "morning")}
                hasItem={!!item}
                item={item}
              />
            );
          })}
        </div>
      </div>

      {/* AFTERNOON COLUMN */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-sky-300 text-white font-bold p-2 text-center">
          Afternoon (12:00–17:45)
        </div>
        <div className="h-[500px] overflow-y-auto">
          {afternoonSlots.map((time) => {
            const item = getItemForTimeSlot(time, "afternoon");
            return (
              <TimeSlot
                key={`afternoon-${time}`}
                time={time}
                onClick={() => onTimeSlotClick(time, "afternoon")}
                hasItem={!!item}
                item={item}
              />
            );
          })}
        </div>
      </div>

      {/* EVENING COLUMN */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-400 to-indigo-300 text-white font-bold p-2 text-center">
          Evening (18:00–23:45)
        </div>
        <div className="h-[500px] overflow-y-auto">
          {eveningSlots.map((time) => {
            const item = getItemForTimeSlot(time, "evening");
            return (
              <TimeSlot
                key={`evening-${time}`}
                time={time}
                onClick={() => onTimeSlotClick(time, "evening")}
                hasItem={!!item}
                item={item}
              />
            );
          })}
        </div>
      </div>

      {/* MIDNIGHT COLUMN */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold p-2 text-center">
          Midnight (00:00–05:45)
        </div>
        <div className="h-[500px] overflow-y-auto">
          {midnightSlots.map((time) => {
            const item = getItemForTimeSlot(time, "midnight");
            return (
              <TimeSlot
                key={`midnight-${time}`}
                time={time}
                onClick={() => onTimeSlotClick(time, "midnight")}
                hasItem={!!item}
                item={item}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlannerSchedule;
