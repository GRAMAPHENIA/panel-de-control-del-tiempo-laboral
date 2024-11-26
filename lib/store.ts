"use client";

import { create } from "zustand";
import { Task, Timer, Report } from "@/types";
import { persist } from "zustand/middleware";
import { addSeconds, startOfDay, endOfDay, isWithinInterval } from "date-fns";

interface StoreState {
  tasks: Task[];
  activeTimer: Timer | null;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt" | "totalTime">
  ) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
  getTaskStats: () => {
    totalTasksToday: number;
    completedTasksToday: number;
    totalTimeToday: number;
  };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tasks: [],
      activeTimer: null,

      addTask: (taskData) => {
        const task: Task = {
          id: crypto.randomUUID(),
          ...taskData,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalTime: 0,
        };

        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },

      deleteTask: (taskId) => {
        const state = get();
        if (state.activeTimer?.taskId === taskId) {
          state.stopTimer(taskId);
        }
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },

      startTimer: (taskId) => {
        const currentTimer = get().activeTimer;
        if (currentTimer) {
          get().stopTimer(currentTimer.taskId);
        }

        set({
          activeTimer: {
            taskId,
            startTime: new Date().toISOString(),
            endTime: null,
          },
        });
      },

      stopTimer: (taskId) => {
        const state = get();
        const timer = state.activeTimer;

        if (timer && timer.taskId === taskId && timer.startTime) {
          const endTime = new Date();
          const startTime = new Date(timer.startTime);
          const duration = Math.floor(
            (endTime.getTime() - startTime.getTime()) / 1000
          );

          set((state) => ({
            activeTimer: null,
            tasks: state.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    totalTime: task.totalTime + duration,
                    updatedAt: new Date(),
                  }
                : task
            ),
          }));
        }
      },

      getTaskStats: () => {
        const state = get();
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        const todaysTasks = state.tasks.filter((task) =>
          isWithinInterval(new Date(task.createdAt), { start, end })
        );

        const totalTimeToday = todaysTasks.reduce(
          (acc, task) => acc + task.totalTime,
          0
        );

        return {
          totalTasksToday: todaysTasks.length,
          completedTasksToday: todaysTasks.filter(
            (task) => task.status === "completed"
          ).length,
          totalTimeToday: totalTimeToday,
        };
      },
    }),
    {
      name: "time-tracker-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          return {
            ...data,
            state: {
              ...data.state,
              tasks: data.state.tasks.map((task: any) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt),
              })),
              activeTimer: data.state.activeTimer
                ? {
                    ...data.state.activeTimer,
                    startTime: data.state.activeTimer.startTime
                      ? data.state.activeTimer.startTime
                      : null,
                    endTime: data.state.activeTimer.endTime
                      ? data.state.activeTimer.endTime
                      : null,
                  }
                : null,
            },
          };
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
