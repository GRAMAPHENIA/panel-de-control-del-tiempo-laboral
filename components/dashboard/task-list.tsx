"use client";

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDuration } from '@/lib/utils';
import { Play, Pause, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Task } from '@/types';

export function TaskList() {
  const [mounted, setMounted] = useState(false);
  const store = useStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<{[key: string]: number}>({});

  useEffect(() => {
    setMounted(true);
    setTasks(store.tasks);
    setActiveTimer(store.activeTimer?.taskId || null);
  }, [store.tasks, store.activeTimer?.taskId]);

  useEffect(() => {
    if (!activeTimer) return;

    const startTime = store.activeTimer?.startTime ? new Date(store.activeTimer.startTime) : null;
    if (!startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      setCurrentTime(prev => ({
        ...prev,
        [activeTimer]: elapsed
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, store.activeTimer?.startTime]);

  if (!mounted) {
    return null;
  }

  const handleTimerToggle = (taskId: string) => {
    if (store.activeTimer?.taskId === taskId) {
      store.stopTimer(taskId);
      setCurrentTime(prev => {
        const newTime = { ...prev };
        delete newTime[taskId];
        return newTime;
      });
    } else {
      store.startTimer(taskId);
    }
  };

  const handleStatusToggle = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    store.updateTask(taskId, { status: newStatus });
  };

  const getDisplayTime = (task: Task) => {
    if (activeTimer === task.id) {
      return formatDuration(task.totalTime + (currentTime[task.id] || 0));
    }
    return formatDuration(task.totalTime);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              <p className="text-sm mt-1">
                Tiempo total: {getDisplayTime(task)}
                {activeTimer === task.id && (
                  <span className="ml-2 text-primary animate-pulse">
                    (Cronómetro activo)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleTimerToggle(task.id)}
                title={activeTimer === task.id ? "Pausar temporizador" : "Iniciar temporizador"}
              >
                {activeTimer === task.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleStatusToggle(task.id, task.status)}
                title="Cambiar estado"
              >
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  readOnly
                  className="h-4 w-4"
                />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => store.deleteTask(task.id)}
                title="Eliminar tarea"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {tasks.length === 0 && (
        <p className="text-center text-muted-foreground">
          No hay tareas registradas. ¡Comienza agregando una!
        </p>
      )}
    </div>
  );
}