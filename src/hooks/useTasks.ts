
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/goal';
import { useToast } from '@/hooks/use-toast';

export const useTasks = (goalId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async (targetGoalId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('tasks').select('*');

      // If targetGoalId is provided, filter by that
      // If goalId is provided (from hook parameter), filter by that
      // Otherwise, fetch all tasks
      if (targetGoalId) {
        query = query.eq('goal_id', targetGoalId);
      } else if (goalId) {
        query = query.eq('goal_id', goalId);
      }

      const { data, error } = await query.order('position', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
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
      
      setTasks(prev => prev.map(task => task.id === taskId ? data : task));
      
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

  const fetchAllTasks = async () => {
    await fetchTasks(); // This will fetch all tasks since no goalId is specified
  };

  useEffect(() => {
    // Always fetch tasks - either for specific goal or all tasks
    fetchTasks();
  }, [goalId]);

  return {
    tasks,
    loading,
    fetchTasks,
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    getAllTasks,
  };
};
