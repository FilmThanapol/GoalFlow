
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal, Task } from '@/types/goal';
import { useTasksContext } from '@/contexts/TasksContext';
import { Plus, Trash2, GripVertical, Clock, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { goalTemplates } from '@/data/goalTemplates';

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
  const { tasks: allTasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasksContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Filter tasks for this specific goal
  const tasks = allTasks.filter(task => task.goal_id === goal.id);

  // Get template tasks for the current goal category
  const relevantTemplate = goalTemplates.find(t => t.category === goal.category);
  const templateTasks = relevantTemplate?.tasks || [];

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

  const handleAddTemplateTask = async (taskTitle: string) => {
    await createTask({
      goal_id: goal.id,
      title: taskTitle,
      is_completed: false,
      position: tasks.length,
    });
  };

  const handleAddAllTemplateTasks = async () => {
    for (let i = 0; i < templateTasks.length; i++) {
      await createTask({
        goal_id: goal.id,
        title: templateTasks[i],
        is_completed: false,
        position: tasks.length + i,
      });
    }
  };

  const completedTasks = tasks.filter(task => task.is_completed).length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{goal.title}</span>
              <Badge variant="secondary">
                {completedTasks}/{tasks.length} tasks
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {progress}% complete
              </div>
              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="templates">Task Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
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
                  <Circle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-2">No tasks yet</p>
                  <p className="text-sm">Add your first task above or use templates!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
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
                        {task.is_completed && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            {templateTasks.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Suggested Tasks for {goal.category || 'General'} Goals</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Based on the "{relevantTemplate?.title}" template
                    </p>
                  </div>
                  <Button
                    onClick={handleAddAllTemplateTasks}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    Add All Tasks
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {templateTasks.map((taskTitle, index) => {
                      const isAlreadyAdded = tasks.some(task => task.title === taskTitle);
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                            isAlreadyAdded
                              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
                          }`}
                        >
                          <div className="flex-1">
                            <span className={`${isAlreadyAdded ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                              {taskTitle}
                            </span>
                          </div>
                          {isAlreadyAdded ? (
                            <Badge variant="secondary" className="text-green-700 bg-green-100 dark:bg-green-900/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Added
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddTemplateTask(taskTitle)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium mb-2">No templates available</p>
                <p className="text-sm">Templates are not available for this goal category yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TasksDialog;
