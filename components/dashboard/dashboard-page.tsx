"use client";

import { useStore } from '@/lib/store';
import { TaskList } from './task-list';
import { TaskForm } from './task-form';
import { StatsCard } from './stats-card';
import { formatDuration } from '@/lib/utils';
import { Clock, CheckCircle, ListTodo } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types';

export function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const getTaskStats = useStore((state) => state.getTaskStats);
  const activeTimer = useStore((state) => state.activeTimer);
  const tasks = useStore((state) => state.tasks);

  const [stats, setStats] = useState<Pick<DashboardStats, 'totalTasksToday' | 'completedTasksToday' | 'totalTimeToday'>>({
    totalTasksToday: 0,
    completedTasksToday: 0,
    totalTimeToday: 0,
  });

  const [currentActiveTime, setCurrentActiveTime] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Actualizar estadísticas cuando cambian las tareas o el temporizador
  useEffect(() => {
    setStats(getTaskStats());
  }, [tasks, getTaskStats]);

  // Actualizar el tiempo activo actual
  useEffect(() => {
    if (!activeTimer?.startTime) {
      setCurrentActiveTime(0);
      return;
    }

    const startTime = new Date(activeTimer.startTime);
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setCurrentActiveTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer?.startTime]);

  if (!mounted) {
    return null;
  }

  // Calcular tiempo total incluyendo el tiempo activo actual
  const totalTimeWithCurrent = stats.totalTimeToday + currentActiveTime;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Panel de Control de Tiempo</h1>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatsCard
            title="Tiempo Total Hoy"
            value={formatDuration(totalTimeWithCurrent)}
            icon={<Clock className="h-6 w-6" />}
          />
          <StatsCard
            title="Tareas Completadas"
            value={stats.completedTasksToday.toString()}
            icon={<CheckCircle className="h-6 w-6" />}
          />
          <StatsCard
            title="Total de Tareas"
            value={stats.totalTasksToday.toString()}
            icon={<ListTodo className="h-6 w-6" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tareas</h2>
            <TaskList />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Agregar Nueva Tarea</h2>
            <TaskForm />
          </div>
        </div>
      </div>
    </div>
  );
}