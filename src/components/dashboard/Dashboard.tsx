import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Plus, Target, TrendingUp, CheckCircle, Calendar, Star, Trophy, Zap, BarChart3, Settings, Award, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { t } = useTranslation();
  const { goals, loading, createGoal, updateGoal, deleteGoal } = useGoals();
  const { getTaskStats, getAllTasks, fetchAllTasks } = useTasks();
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

  // Fetch all tasks when component mounts
  useEffect(() => {
    fetchAllTasks();
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-pink-300 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <Sparkles className="w-6 h-6 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                <span>Loading your goals...</span>
                <span className="animate-pulse">✨</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Setting up your personalized dashboard</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in-50 duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {t('welcome')} 
                <span className="animate-bounce">👋</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                {t('trackProgress')}
                <Sparkles className="w-4 h-4 text-purple-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Tabs for Dashboard, Analytics, Achievements, and Settings */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-pink-200 dark:border-purple-700 rounded-2xl p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Target className="w-4 h-4" />
              {t('dashboard')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              {t('analytics')}
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white">
              <Award className="w-4 h-4" />
              {t('achievements')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4" />
              {t('settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Daily Quote */}
            <DailyQuote />

            {/* Enhanced Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/10 backdrop-blur-sm border-pink-200 dark:border-pink-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 dark:bg-pink-900/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('totalGoals')}</CardTitle>
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl group-hover:bg-pink-200 dark:group-hover:bg-pink-800/40 transition-colors">
                    <Target className="h-4 w-4 text-pink-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <span>{t('allGoals')}</span>
                    <span>🎯</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/10 backdrop-blur-sm border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('completed')}</CardTitle>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% complete` : 'No goals yet'}
                    <span>🎉</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/10 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('inProgress')}</CardTitle>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl group-hover:bg-orange-200 dark:group-hover:bg-orange-800/40 transition-colors">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-orange-600">{stats.inProgress}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <span>{t('activeGoals')}</span>
                    <span>⚡</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/10 backdrop-blur-sm border-yellow-200 dark:border-yellow-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('favorites')}</CardTitle>
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/40 transition-colors">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-yellow-600">{stats.favorites}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <span>{t('starredGoals')}</span>
                    <span>⭐</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Goals Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Zap className="w-8 h-8 text-purple-600" />
                  {t('yourGoals')}
                  <span className="text-2xl">✨</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 flex items-center gap-2">
                  {goals.length > 0 ? (
                    <>
                      <span>{t('goalsInProgress', { count: goals.length })}</span>
                      <span>🚀</span>
                    </>
                  ) : (
                    <>
                      <span>{t('startYourJourney')}</span>
                      <span>🌱</span>
                    </>
                  )}
                </p>
              </div>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl px-6 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('createGoal')}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {goals.length === 0 ? (
              <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 backdrop-blur-sm border-purple-200 dark:border-purple-700 animate-in fade-in-50 duration-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 via-purple-100/20 to-blue-100/20 dark:from-pink-900/10 dark:via-purple-900/10 dark:to-blue-900/10"></div>
                <CardContent className="flex flex-col items-center justify-center py-16 relative z-10">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-blue-900/30 rounded-3xl flex items-center justify-center">
                      <Target className="w-12 h-12 text-purple-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <Sparkles className="w-6 h-6 text-pink-500 absolute -bottom-2 -left-2 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                    {t('readyToAchieve')}
                    <span className="animate-bounce">🌟</span>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md leading-relaxed">
                    {t('firstGoalDescription')}
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl px-8 py-4 text-lg"
                    size="lg"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    {t('createYourFirstGoal')}
                    <Heart className="w-5 h-5 ml-3 text-pink-200" />
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
