
import React, { useState } from 'react';
import Header from './Header';
import GoalCard from '@/components/goals/GoalCard';
import CreateGoalDialog from '@/components/goals/CreateGoalDialog';
import EditGoalDialog from '@/components/goals/EditGoalDialog';
import TasksDialog from '@/components/goals/TasksDialog';
import { useGoals } from '@/hooks/useGoals';
import { useTasks } from '@/hooks/useTasks';
import { Goal } from '@/types/goal';
import { Button } from '@/components/ui/button';
import { Plus, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { goals, loading, createGoal, updateGoal, deleteGoal } = useGoals();
  const { getTaskStats } = useTasks();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoalForTasks, setSelectedGoalForTasks] = useState<Goal | null>(null);

  const handleCreateGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await createGoal(goalData);
    setIsCreateDialogOpen(false);
  };

  const handleEditGoal = async (goalData: Partial<Goal>) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData);
      setEditingGoal(null);
    }
  };

  const handleToggleFavorite = async (goalId: string, isFavorite: boolean) => {
    await updateGoal(goalId, { is_favorite: isFavorite });
  };

  const stats = {
    total: goals.length,
    completed: goals.filter(goal => goal.is_completed).length,
    inProgress: goals.filter(goal => !goal.is_completed).length,
    favorites: goals.filter(goal => goal.is_favorite).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Target className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.favorites}</div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Goals</h2>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>

        {goals.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No goals yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                Start your journey by creating your first goal. Break it down into tasks and track your progress!
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const taskStats = getTaskStats(goal.id);
              return (
                <div key={goal.id} onClick={() => setSelectedGoalForTasks(goal)} className="cursor-pointer">
                  <GoalCard
                    goal={goal}
                    completedTasks={taskStats.completed}
                    totalTasks={taskStats.total}
                    onEdit={setEditingGoal}
                    onDelete={deleteGoal}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <CreateGoalDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateGoal}
      />

      {editingGoal && (
        <EditGoalDialog
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
          goal={editingGoal}
          onSubmit={handleEditGoal}
        />
      )}

      {selectedGoalForTasks && (
        <TasksDialog
          open={!!selectedGoalForTasks}
          onOpenChange={(open) => !open && setSelectedGoalForTasks(null)}
          goal={selectedGoalForTasks}
        />
      )}
    </div>
  );
};

export default Dashboard;
