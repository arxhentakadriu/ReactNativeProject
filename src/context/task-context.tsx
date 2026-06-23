import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { Task, TaskDraft } from '@/types/task';
import { readStorageValue, writeStorageValue } from '@/utils/storage';

type TaskContextValue = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (draft: TaskDraft) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  toggleTask: (id: string) => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);
const TASK_STORAGE_KEY = 'taskmanager.tasks';

function readUserTasks() {
  const storedTasks = readStorageValue<Task[]>(TASK_STORAGE_KEY, []);
  const userTasks = storedTasks.filter(
    (task) => task.source !== 'api' && !task.id.startsWith('api-'),
  );

  if (userTasks.length !== storedTasks.length) {
    writeStorageValue(TASK_STORAGE_KEY, userTasks);
  }

  return userTasks;
}

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState(readUserTasks);

  const persistTasks = useCallback((updater: (currentTasks: Task[]) => Task[]) => {
    setTasks((currentTasks) => {
      const nextTasks = updater(currentTasks);
      try {
        writeStorageValue(TASK_STORAGE_KEY, nextTasks);
      } catch {
        // Keep tasks in memory even if local storage is unavailable.
      }
      return nextTasks;
    });
  }, []);

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      isLoading: false,
      error: null,
      addTask: (draft) => {
        const createdAt = new Date().toISOString();
        const task: Task = {
          id: `user-${Date.now()}`,
          title: draft.title.trim(),
          description: draft.description.trim(),
          completed: false,
          createdAt,
        };
        persistTasks((currentTasks) => [task, ...currentTasks]);
      },
      deleteTask: (id) => {
        persistTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
      },
      getTaskById: (id) => tasks.find((task) => task.id === id),
      toggleTask: (id) => {
        persistTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        );
      },
    }),
    [persistTasks, tasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const value = useContext(TaskContext);

  if (!value) {
    throw new Error('useTasks must be used inside TaskProvider.');
  }

  return value;
}
