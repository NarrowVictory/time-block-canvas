
type ScheduleItem = {
  id: string;
  time: string;
  activity: string;
  duration: number;
  notes: string;
  column: "morning" | "afternoon" | "evening" | "midnight";
};

type TodoItem = {
  id: string;
  activity: string;
  duration: number;
  notes: string;
};

type PlannerData = {
  todos: Record<string, TodoItem[]>;
  schedules: Record<string, ScheduleItem[]>;
};

const STORAGE_KEY = 'daily-planner-data';

// Helper to format date as YYYY-MM-DD for storage
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get initial data
const getInitialData = (): PlannerData => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing stored data:', error);
      return { todos: {}, schedules: {} };
    }
  }
  return { todos: {}, schedules: {} };
};

// Save data to storage
const saveData = (data: PlannerData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Get todos for a specific date
export const getTodosByDate = (date: Date): TodoItem[] => {
  const data = getInitialData();
  const dateKey = formatDate(date);
  return data.todos[dateKey] || [];
};

// Save todos for a specific date
export const saveTodosByDate = (date: Date, todos: TodoItem[]) => {
  const data = getInitialData();
  const dateKey = formatDate(date);
  data.todos[dateKey] = todos;
  saveData(data);
};

// Get schedule items for a specific date
export const getSchedulesByDate = (date: Date): ScheduleItem[] => {
  const data = getInitialData();
  const dateKey = formatDate(date);
  return data.schedules[dateKey] || [];
};

// Save schedule items for a specific date
export const saveSchedulesByDate = (date: Date, schedules: ScheduleItem[]) => {
  const data = getInitialData();
  const dateKey = formatDate(date);
  data.schedules[dateKey] = schedules;
  saveData(data);
};
