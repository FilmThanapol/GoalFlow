
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Goal, Task } from '@/types/goal';
import { useTasks } from '@/hooks/useTasks';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
}

const TasksDialog: React.FC<TasksDialogProps> = ({
  open,
  onOpenChange,
  goal,
}) => {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (goal?.id) {
      fetchTasks(goal.id);
    }
  }, [goal?.id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask({
      goal_id: goal.id,
      title: newTaskTitle.trim(),
      is_completed: false,
      position: tasks.length,
    });

    setNewTaskTitle('');
  };

  const handleToggleTask = async (task: Task) => {
    await updateTask(task.id, { is_completed: !task.is_completed });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const completedTasks = tasks.filter(task => task.is_completed).length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{goal.title}</span>
            <Badge variant="secondary">
              {completedTasks}/{tasks.length} completed ({progress}%)
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new task form */}
          <form onSubmit={handleCreateTask} className="flex gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </form>

          {/* Tasks list */}
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks yet. Add your first task above!
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <Checkbox
                      checked={task.is_completed}
                      onCheckedChange={() => handleToggleTask(task)}
                    />
                    <span
                      className={`flex-1 ${
                        task.is_completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Progress summary */}
          {tasks.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Progress</span>
                <span>{progress}% complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TasksDialog;
