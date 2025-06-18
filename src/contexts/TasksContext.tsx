import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/goal';
import { useToast } from '@/hooks/use-toast';

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  fetchTasks: (goalId?: string) => Promise<void>;
  fetchAllTasks: () => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  getTaskStats: (goalId: string) => { completed: number; total: number };
  getAllTasks: () => Task[];
  refreshTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async (goalId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('tasks').select('*');
      
      if (goalId) {
        query = query.eq('goal_id', goalId);
      }
      
      const { data, error } = await query.order('position', { ascending: true });

      if (error) throw error;
      
      if (goalId) {
        // If fetching for a specific goal, update only those tasks
        setTasks(prev => {
          const otherTasks = prev.filter(task => task.goal_id !== goalId);
          return [...otherTasks, ...(data || [])];
        });
      } else {
        // If fetching all tasks, replace all
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    await fetchTasks();
  };

  const refreshTasks = async () => {
    await fetchAllTasks();
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      // Update the task in state immediately for real-time UI updates
      setTasks(prev => prev.map(task => task.id === taskId ? data : task));

      // Check if all tasks for this goal are now completed and update goal status
      if (updates.is_completed !== undefined && data.goal_id) {
        const goalTasks = tasks.filter(task => task.goal_id === data.goal_id);
        const updatedTasks = goalTasks.map(task => task.id === taskId ? data : task);
        const allCompleted = updatedTasks.length > 0 && updatedTasks.every(task => task.is_completed);

        // Update goal completion status if needed
        if (allCompleted || (!updates.is_completed && updatedTasks.some(task => !task.is_completed))) {
          try {
            await supabase
              .from('goals')
              .update({
                is_completed: allCompleted,
                updated_at: new Date().toISOString()
              })
              .eq('id', data.goal_id);
          } catch (goalError) {
            console.warn('Failed to update goal completion status:', goalError);
          }
        }
      }

      // Show success toast for task completion
      if (updates.is_completed !== undefined) {
        toast({
          title: updates.is_completed ? "Task Completed!" : "Task Reopened",
          description: updates.is_completed
            ? "Great job! Keep up the momentum!"
            : "Task marked as incomplete.",
          variant: updates.is_completed ? "default" : "secondary",
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getTaskStats = (goalId: string) => {
    const goalTasks = tasks.filter(task => task.goal_id === goalId);
    const completedTasks = goalTasks.filter(task => task.is_completed).length;
    return {
      completed: completedTasks,
      total: goalTasks.length,
    };
  };

  const getAllTasks = () => {
    return tasks;
  };

  // Fetch all tasks on mount
  useEffect(() => {
    fetchAllTasks();
  }, []);

  const value: TasksContextType = {
    tasks,
    loading,
    fetchTasks,
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    getAllTasks,
    refreshTasks,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
};

export default TasksContext;
