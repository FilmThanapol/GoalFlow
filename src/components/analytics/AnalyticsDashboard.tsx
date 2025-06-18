import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { Goal, Task } from '@/types/goal';
import { useTasksContext } from '@/contexts/TasksContext';
import {
  TrendingUp,
  Target,
  Calendar,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsDashboardProps {
  goals: Goal[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#EC4899', '#06B6D4'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ goals }) => {
  const { t } = useTranslation();
  const { getAllTasks } = useTasksContext();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  const allTasks = getAllTasks();

  // Helper function to filter data by time range
  const getDateCutoff = (timeRange: '7d' | '30d' | '90d' | '1y') => {
    const now = new Date();
    switch (timeRange) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  };

  // Enhanced analytics calculations with real data
  const analyticsData = useMemo(() => {
    try {
      const cutoffDate = getDateCutoff(selectedTimeRange);

      // Filter goals and tasks based on selected time range
      const filteredGoals = goals.filter(goal => {
        const goalDate = new Date(goal.created_at);
        return goalDate >= cutoffDate;
      });

      const filteredTasks = allTasks.filter(task => {
        const taskDate = new Date(task.created_at);
        return taskDate >= cutoffDate;
      });

      const totalGoals = filteredGoals.length;

      // Calculate completed goals using the same logic as Dashboard
      const completedGoals = filteredGoals.filter(goal => {
        const goalTasks = filteredTasks.filter(task => task.goal_id === goal.id);
        // A goal is completed if it's marked as completed OR all tasks are done
        return goal.is_completed || (goalTasks.length > 0 && goalTasks.every(task => task.is_completed));
      }).length;

      const inProgressGoals = totalGoals - completedGoals;
      const favoriteGoals = filteredGoals.filter(goal => goal.is_favorite).length;
      const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

      // Task analytics
      const totalTasks = filteredTasks.length;
      const completedTasks = filteredTasks.filter(task => task.is_completed).length;
      const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Goals with deadlines
      const goalsWithDeadlines = filteredGoals.filter(goal => goal.target_date);
      const overdueGoals = goalsWithDeadlines.filter(goal => {
        if (!goal.target_date || goal.is_completed) return false;
        return new Date(goal.target_date) < new Date();
      }).length;

      // Category breakdown with real completion data
      const categoryData = filteredGoals.reduce((acc, goal) => {
        const category = goal.category || 'general';
        if (!acc[category]) {
          acc[category] = { total: 0, completed: 0 };
        }
        acc[category].total += 1;

        // Use the same completion logic as Dashboard
        const goalTasks = filteredTasks.filter(task => task.goal_id === goal.id);
        const isCompleted = goal.is_completed || (goalTasks.length > 0 && goalTasks.every(task => task.is_completed));

        if (isCompleted) {
          acc[category].completed += 1;
        }
        return acc;
      }, {} as Record<string, { total: number; completed: number }>);

      const categoryChartData = Object.entries(categoryData).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: data.total,
        completed: data.completed,
        completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0
      }));

      // Real time-based data that adapts to selected range
      const monthlyData = (() => {
        const periods = [];
        const now = new Date();

        // Configure periods based on time range
        let numPeriods, isDaily, dateFormat;

        switch (selectedTimeRange) {
          case '7d':
            numPeriods = 7;
            isDaily = true;
            dateFormat = { weekday: 'short' }; // Mon, Tue, Wed
            break;
          case '30d':
            numPeriods = 30;
            isDaily = true;
            dateFormat = { month: 'numeric', day: 'numeric' }; // 12/15 (shorter format)
            break;
          case '90d':
            numPeriods = 3;
            isDaily = false;
            dateFormat = { month: 'short' }; // Dec
            break;
          case '1y':
            numPeriods = 12;
            isDaily = false;
            dateFormat = { month: 'short' }; // Dec
            break;
          default:
            numPeriods = 12;
            isDaily = false;
            dateFormat = { month: 'short' };
        }

        for (let i = numPeriods - 1; i >= 0; i--) {
          let date, dateKey, dateName;

          if (isDaily) {
            // Daily data for 7d and 30d
            date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            dateKey = date.toISOString().slice(0, 10); // YYYY-MM-DD format
            dateName = date.toLocaleDateString('en', dateFormat);
          } else {
            // Monthly data for 90d and 1y
            const monthsBack = selectedTimeRange === '90d' ? i * 1 : i; // 3 months vs 12 months
            date = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
            dateKey = date.toISOString().slice(0, 7); // YYYY-MM format
            dateName = date.toLocaleDateString('en', dateFormat);
          }

          // Count goals/tasks for this period
          const createdInPeriod = goals.filter(goal => {
            const goalDate = new Date(goal.created_at);
            if (isDaily) {
              return goal.created_at.startsWith(dateKey);
            } else {
              return goal.created_at.startsWith(dateKey);
            }
          }).length;

          const completedInPeriod = goals.filter(goal => {
            const goalTasks = allTasks.filter(task => task.goal_id === goal.id);
            const isCompleted = goal.is_completed || (goalTasks.length > 0 && goalTasks.every(task => task.is_completed));
            if (isDaily) {
              return isCompleted && goal.updated_at.startsWith(dateKey);
            } else {
              return isCompleted && goal.updated_at.startsWith(dateKey);
            }
          }).length;

          const tasksCreatedInPeriod = allTasks.filter(task => {
            if (isDaily) {
              return task.created_at.startsWith(dateKey);
            } else {
              return task.created_at.startsWith(dateKey);
            }
          }).length;

          const tasksCompletedInPeriod = allTasks.filter(task => {
            if (isDaily) {
              return task.is_completed && task.updated_at.startsWith(dateKey);
            } else {
              return task.is_completed && task.updated_at.startsWith(dateKey);
            }
          }).length;

          periods.push({
            month: dateName,
            created: createdInPeriod,
            completed: completedInPeriod,
            tasksCreated: tasksCreatedInPeriod,
            tasksCompleted: tasksCompletedInPeriod,
            date: dateKey
          });
        }

        return periods;
      })();

      // Calculate streaks based on real completion data
      const calculateStreaks = () => {
        const completedGoalDates = filteredGoals
          .filter(goal => {
            const goalTasks = filteredTasks.filter(task => task.goal_id === goal.id);
            return goal.is_completed || (goalTasks.length > 0 && goalTasks.every(task => task.is_completed));
          })
          .map(goal => new Date(goal.updated_at).toDateString())
          .sort();

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Simple streak calculation (can be enhanced)
      const uniqueDates = [...new Set(completedGoalDates)];
      const today = new Date().toDateString();

      // Calculate current streak
      for (let i = uniqueDates.length - 1; i >= 0; i--) {
        const date = new Date(uniqueDates[i]);
        const daysDiff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate longest streak
      for (let i = 0; i < uniqueDates.length; i++) {
        tempStreak = 1;
        for (let j = i + 1; j < uniqueDates.length; j++) {
          const prevDate = new Date(uniqueDates[j - 1]);
          const currDate = new Date(uniqueDates[j]);
          const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff <= 1) {
            tempStreak++;
          } else {
            break;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      return { currentStreak, longestStreak };
    };

      const { currentStreak, longestStreak } = calculateStreaks();

      return {
        totalGoals,
        completedGoals,
        inProgressGoals,
        favoriteGoals,
        completionRate,
        totalTasks,
        completedTasks,
        taskCompletionRate,
        overdueGoals,
        categoryChartData,
        monthlyData,
        currentStreak,
        longestStreak,
        goalsWithDeadlines: goalsWithDeadlines.length
      };
    } catch (error) {
      console.error('Error calculating analytics data:', error);
      // Return safe default values
      return {
        totalGoals: 0,
        completedGoals: 0,
        inProgressGoals: 0,
        favoriteGoals: 0,
        completionRate: 0,
        totalTasks: 0,
        completedTasks: 0,
        taskCompletionRate: 0,
        overdueGoals: 0,
        categoryChartData: [],
        monthlyData: [],
        currentStreak: 0,
        longestStreak: 0,
        goalsWithDeadlines: 0
      };
    }
  }, [goals, allTasks, selectedTimeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Force re-calculation of analytics data
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Add loading state for better UX
  if (!goals || !allTasks) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('analyticsDashboard')}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t('insightsIntoProgress')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
                className="text-xs px-2 py-1"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Goal Completion</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{analyticsData.completionRate.toFixed(1)}%</div>
            <Progress value={analyticsData.completionRate} className="mt-2" />
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{analyticsData.completedGoals}/{analyticsData.totalGoals} goals</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Task Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{analyticsData.taskCompletionRate.toFixed(1)}%</div>
            <Progress value={analyticsData.taskCompletionRate} className="mt-2" />
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{analyticsData.completedTasks}/{analyticsData.totalTasks} tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{analyticsData.currentStreak}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {analyticsData.currentStreak > 0 ? 'Keep it up!' : 'Start your streak!'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Best Streak</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{analyticsData.longestStreak}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Personal record</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Goals</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{analyticsData.inProgressGoals}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">In progress</p>
            {analyticsData.overdueGoals > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500">{analyticsData.overdueGoals} overdue</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="trends">{t('trends')}</TabsTrigger>
          <TabsTrigger value="categories">{t('categories')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Category Breakdown */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                    Goals by Category
                  </div>
                  <Badge variant="secondary">{analyticsData.totalGoals} total</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 sm:h-80">
                  {analyticsData.categoryChartData && analyticsData.categoryChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.categoryChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => percent > 5 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                          outerRadius="80%"
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData.categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [value, name]}
                          labelFormatter={(label) => `Category: ${label}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <PieChartIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No category data available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Activity Progress */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    {selectedTimeRange === '7d' ? 'Daily Activity' :
                     selectedTimeRange === '30d' ? 'Daily Activity' :
                     'Monthly Activity'}
                  </div>
                  <Badge variant="secondary">
                    {selectedTimeRange === '7d' ? 'Last 7 days' :
                     selectedTimeRange === '30d' ? 'Last 30 days' :
                     selectedTimeRange === '90d' ? 'Last 3 months' :
                     'Last 12 months'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 sm:h-80">
                  {analyticsData.monthlyData && analyticsData.monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={analyticsData.monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: selectedTimeRange === '7d' ? 40 : selectedTimeRange === '30d' ? 60 : 60
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: selectedTimeRange === '7d' ? 11 : 10 }}
                          interval={selectedTimeRange === '7d' ? 0 : selectedTimeRange === '30d' ? 4 : 0}
                          angle={selectedTimeRange === '7d' ? 0 : selectedTimeRange === '30d' ? -45 : -45}
                          textAnchor={selectedTimeRange === '7d' ? 'middle' : 'end'}
                          height={selectedTimeRange === '7d' ? 40 : 60}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value, name) => [value, name === 'created' ? 'Goals Created' : name === 'completed' ? 'Goals Completed' : name]}
                          labelFormatter={(label) => `${selectedTimeRange === '7d' || selectedTimeRange === '30d' ? 'Day' : 'Month'}: ${label}`}
                        />
                        <Bar dataKey="created" fill="#3B82F6" name="Goals Created" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="completed" fill="#10B981" name="Goals Completed" radius={[2, 2, 0, 0]} />
                        <Line type="monotone" dataKey="tasksCompleted" stroke="#F59E0B" strokeWidth={2} name="Tasks Completed" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No activity data available for selected period</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Enhanced Progress Trend */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  {selectedTimeRange === '7d' || selectedTimeRange === '30d' ? 'Daily' : 'Monthly'} Completion Trends
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600">
                    Goals: {analyticsData.completedGoals}
                  </Badge>
                  <Badge variant="outline" className="text-blue-600">
                    Tasks: {analyticsData.completedTasks}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {analyticsData.monthlyData && analyticsData.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analyticsData.monthlyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: selectedTimeRange === '7d' ? 40 : selectedTimeRange === '30d' ? 60 : 60
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: selectedTimeRange === '7d' ? 11 : 10 }}
                        interval={selectedTimeRange === '7d' ? 0 : selectedTimeRange === '30d' ? 4 : 0}
                        angle={selectedTimeRange === '7d' ? 0 : selectedTimeRange === '30d' ? -45 : -45}
                        textAnchor={selectedTimeRange === '7d' ? 'middle' : 'end'}
                        height={selectedTimeRange === '7d' ? 40 : 60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name) => [value, name === 'completed' ? 'Goals Completed' : 'Tasks Completed']}
                        labelFormatter={(label) => `${selectedTimeRange === '7d' || selectedTimeRange === '30d' ? 'Day' : 'Period'}: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stackId="1"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.6}
                        name="Goals Completed"
                      />
                      <Area
                        type="monotone"
                        dataKey="tasksCompleted"
                        stackId="2"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.4}
                        name="Tasks Completed"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No trend data available for selected period</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Timeline Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Goals with Deadlines</span>
                    <Badge variant="secondary">{analyticsData.goalsWithDeadlines}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Overdue Goals</span>
                    <Badge variant={analyticsData.overdueGoals > 0 ? "destructive" : "secondary"}>
                      {analyticsData.overdueGoals}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">On-time Completion Rate</span>
                    <Badge variant="secondary">
                      {analyticsData.goalsWithDeadlines > 0
                        ? ((analyticsData.goalsWithDeadlines - analyticsData.overdueGoals) / analyticsData.goalsWithDeadlines * 100).toFixed(1)
                        : 0}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Goals per Month</span>
                    <Badge variant="secondary">
                      {(analyticsData.totalGoals / 12).toFixed(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Tasks per Goal</span>
                    <Badge variant="secondary">
                      {analyticsData.totalGoals > 0 ? (analyticsData.totalTasks / analyticsData.totalGoals).toFixed(1) : 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Favorite Goals</span>
                    <Badge variant="secondary">{analyticsData.favoriteGoals}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {/* Enhanced Category Performance */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-indigo-600" />
                  Category Performance
                </div>
                <Badge variant="secondary">{analyticsData.categoryChartData.length} categories</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.categoryChartData.length > 0 ? (
                  analyticsData.categoryChartData.map((category, index) => (
                    <div key={category.name} className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.value} goal{category.value !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {category.completionRate.toFixed(1)}% complete
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {category.completed}/{category.value} completed
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={category.completionRate}
                          className="flex-1 h-2"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[3rem] text-right">
                          {category.completionRate.toFixed(0)}%
                        </span>
                      </div>

                      {/* Additional category insights */}
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {category.value - category.completed} remaining
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.completionRate >= 80
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : category.completionRate >= 50
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {category.completionRate >= 80 ? 'Excellent' : category.completionRate >= 50 ? 'Good' : 'Needs Focus'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No categories found. Create some goals to see category performance!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Comparison Chart */}
          {analyticsData.categoryChartData.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Category Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.categoryChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name) => [
                          value,
                          name === 'value' ? 'Total Goals' : name === 'completed' ? 'Completed Goals' : name
                        ]}
                        labelFormatter={(label) => `Category: ${label}`}
                      />
                      <Bar dataKey="value" fill="#3B82F6" name="Total Goals" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="completed" fill="#10B981" name="Completed Goals" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
