
import React, { useState, useEffect } from 'react';
import Header from './Header';
import GoalCard from '@/components/goals/GoalCard';
import CreateGoalDialog from '@/components/goals/CreateGoalDialog';
import EditGoalDialog from '@/components/goals/EditGoalDialog';
import TasksDialog from '@/components/goals/TasksDialog';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import GamificationPanel from '@/components/gamification/GamificationPanel';
import DataManagement from '@/components/settings/DataManagement';
import DailyQuote from '@/components/motivation/DailyQuote';
import FloatingActionButton from '@/components/ui/floating-action-button';
import { useGoals } from '@/hooks/useGoals';
import { useTasks } from '@/hooks/useTasks';
import { useNotifications } from '@/hooks/useNotifications';
import { Goal } from '@/types/goal';
import { Button } from '@/components/ui/button';
import { Plus, Target, TrendingUp, CheckCircle, Calendar, Star, Trophy, Zap, BarChart3, Settings, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { goals, loading, createGoal, updateGoal, deleteGoal } = useGoals();
  const { getTaskStats, getAllTasks } = useTasks();
  const allTasks = getAllTasks();
  const completedTasksCount = allTasks.filter(task => task.is_completed).length;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoalForTasks, setSelectedGoalForTasks] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + N to create new goal
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        setIsCreateDialogOpen(true);
      }
      // Escape to close dialogs
      if (event.key === 'Escape') {
        setIsCreateDialogOpen(false);
        setEditingGoal(null);
        setSelectedGoalForTasks(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading your goals...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Setting up your personalized dashboard</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in-50 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track your progress and achieve your goals
              </p>
            </div>
          </div>
        </div>

        {/* Tabs for Dashboard, Analytics, Achievements, and Settings */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Daily Quote */}
            <DailyQuote />

            {/* Enhanced Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Goals</CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All your goals</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% complete` : 'No goals yet'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">In Progress</CardTitle>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800/40 transition-colors">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active goals</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Favorites</CardTitle>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/40 transition-colors">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.favorites}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Starred goals</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Goals Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              Your Goals
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {goals.length > 0 ? `${goals.length} goal${goals.length === 1 ? '' : 's'} in progress` : 'Start your journey'}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>

        {goals.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 animate-in fade-in-50 duration-700">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center">
                  <Target className="w-10 h-10 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Ready to achieve something great?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md">
                Start your journey by creating your first goal. Break it down into manageable tasks and track your progress along the way!
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
            {goals.map((goal, index) => {
              const taskStats = getTaskStats(goal.id);
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoalForTasks(goal)}
                  className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <AnalyticsDashboard goals={goals} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <GamificationPanel goals={goals} completedTasks={completedTasksCount} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NotificationSettings goals={goals} />
              <DataManagement goals={goals} />
            </div>
          </TabsContent>
        </Tabs>
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

      {/* Floating Action Button */}
      <FloatingActionButton
        onCreateGoal={() => setIsCreateDialogOpen(true)}
        onOpenAnalytics={() => setActiveTab('analytics')}
        onOpenAchievements={() => setActiveTab('achievements')}
      />
    </div>
  );
};

export default Dashboard;
