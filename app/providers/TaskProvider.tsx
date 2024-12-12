import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Task {
  title: string;
  description: string;
  date: string;
  time: string;
  id: number;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  clearAllTasks: () => void;
  addTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  toggleTaskComplete: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Failed to load tasks from storage", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    if (!loading) {
      const saveTasks = async () => {
        try {
          await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        } catch (error) {
          console.error("Failed to save tasks to storage", error);
        }
      };

      saveTasks();
    }
  }, [tasks, loading]);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => {
      const isDuplicate = prevTasks.some((t) => t.id === task.id);
      if (!isDuplicate) {
        return [...prevTasks, task];
      }
      return prevTasks;
    });
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem("tasks");
      console.log("All tasks cleared from local storage.");
    } catch (error) {
      console.error("Failed to clear tasks:", error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <TaskContext.Provider value={{ tasks, clearAllTasks, addTask, deleteTask, toggleTaskComplete }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
