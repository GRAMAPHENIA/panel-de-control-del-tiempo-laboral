export type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  totalTime: number; // en segundos
  status: 'pending' | 'in-progress' | 'completed';
};

export type Timer = {
  taskId: string;
  startTime: string | null;
  endTime: string | null;
};

export type Report = {
  date: Date;
  totalTasks: number;
  totalTimeWorked: number; // en segundos
  tasksCompleted: number;
};

export type DashboardStats = {
  totalTasksToday: number;
  completedTasksToday: number;
  totalTimeToday: number;
  weeklyStats: Report[];
};