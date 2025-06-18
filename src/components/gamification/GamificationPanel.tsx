import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Star,
  Flame,
  Award,
  Crown,
  ChevronRight,
  Lock,
  Sparkles
} from 'lucide-react';
import { achievements, getRarityColor, calculateUserLevel, Achievement } from '@/data/achievements';
import { Goal } from '@/types/goal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface GamificationPanelProps {
  goals: Goal[];
  completedTasks: number;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ goals, completedTasks }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate user stats with useMemo for performance
  const userStats = useMemo(() => {
    const completedGoals = goals.filter(g => g.is_completed).length;
    const createdGoals = goals.length;
    const categoriesUsed = new Set(goals.map(g => g.category || 'general')).size;

    // Calculate streak data from real goal completion dates
    const completedGoalDates = goals
      .filter(goal => goal.is_completed)
      .map(goal => new Date(goal.updated_at).toDateString())
      .sort();

    let currentStreak = 0;
    let longestStreak = 0;

    // Simple streak calculation based on completion dates
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
    let tempStreak = 0;
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

    return {
      completedGoals,
      createdGoals,
      categoriesUsed,
      currentStreak,
      longestStreak
    };
  }, [goals]);

  // Calculate earned achievements with deterministic logic
  const earnedAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      switch (achievement.requirement.type) {
        case 'goals_completed':
          return userStats.completedGoals >= achievement.requirement.count;
        case 'goals_created':
          return userStats.createdGoals >= achievement.requirement.count;
        case 'tasks_completed':
          return completedTasks >= achievement.requirement.count;
        case 'streak_days':
          return userStats.currentStreak >= achievement.requirement.count;
        case 'categories_used':
          return userStats.categoriesUsed >= achievement.requirement.count;
        case 'special':
          // Deterministic special achievements based on actual data
          if (achievement.id === 'early-bird') {
            // Check if any goal was completed before deadline
            return goals.some(goal =>
              goal.is_completed &&
              goal.target_date &&
              new Date(goal.updated_at) < new Date(goal.target_date)
            );
          }
          if (achievement.id === 'overachiever') {
            // Check if 3 goals were completed in one day
            const completionDates = goals
              .filter(g => g.is_completed)
              .map(g => new Date(g.updated_at).toDateString());
            const dateCounts = completionDates.reduce((acc, date) => {
              acc[date] = (acc[date] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            return Object.values(dateCounts).some(count => count >= 3);
          }
          if (achievement.id === 'perfectionist') {
            // Check if any goal has all tasks completed (mock for now)
            return userStats.completedGoals > 0 && completedTasks > 0;
          }
          return false;
        default:
          return false;
      }
    });
  }, [userStats, completedTasks, goals]);

  const totalPoints = useMemo(() =>
    earnedAchievements.reduce((sum, achievement) => sum + achievement.points, 0),
    [earnedAchievements]
  );

  const userLevel = useMemo(() => calculateUserLevel(totalPoints), [totalPoints]);

  const filteredAchievements = useMemo(() =>
    selectedCategory === 'all'
      ? achievements
      : achievements.filter(a => a.category === selectedCategory),
    [selectedCategory]
  );

  const progressToNextLevel = useMemo(() => {
    if (!userLevel.nextLevelPoints) return 100;
    const pointsInCurrentLevel = totalPoints - (userLevel.nextLevelPoints - (userLevel.nextLevelPoints / userLevel.level));
    const pointsNeededForLevel = userLevel.nextLevelPoints / userLevel.level;
    return Math.min((pointsInCurrentLevel / pointsNeededForLevel) * 100, 100);
  }, [totalPoints, userLevel]);

  // Error boundary wrapper
  if (!goals) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Level Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-white">Level {userLevel.level}</CardTitle>
                <p className="text-purple-100">{userLevel.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-purple-100 text-sm">Total Points</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userLevel.level + 1}</span>
              <span>{userLevel.nextLevelPoints ? `${totalPoints}/${userLevel.nextLevelPoints}` : 'Max Level!'}</span>
            </div>
            <Progress value={progressToNextLevel} className="bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{earnedAchievements.length}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('achievements')}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userStats.currentStreak}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userStats.completedGoals}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Goals Done</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Tasks Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              {t('achievements')}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'goals' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('goals')}
              >
                Goals
              </Button>
              <Button
                variant={selectedCategory === 'tasks' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('tasks')}
              >
                Tasks
              </Button>
              <Button
                variant={selectedCategory === 'streaks' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('streaks')}
              >
                Streaks
              </Button>
              <Button
                variant={selectedCategory === 'special' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('special')}
              >
                Special
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map((achievement) => {
                const isEarned = earnedAchievements.some(e => e.id === achievement.id);
                const IconComponent = achievement.icon;

                if (!IconComponent) {
                  console.warn(`Missing icon for achievement: ${achievement.id}`);
                  return null;
                }

                return (
                  <Dialog key={achievement.id}>
                    <DialogTrigger asChild>
                      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        isEarned ? 'ring-2 ring-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' : 'opacity-60 hover:opacity-80'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${achievement.color} rounded-lg flex items-center justify-center relative shadow-sm`}>
                              <IconComponent className="w-5 h-5 text-white" />
                              {!isEarned && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <Lock className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{achievement.title}</h4>
                              <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                            {isEarned && (
                              <div className="text-yellow-500 flex-shrink-0">
                                <Trophy className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${achievement.color} rounded-lg flex items-center justify-center shadow-sm`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold">{achievement.title}</div>
                            <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity} • {achievement.points} points
                            </Badge>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">
                          {achievement.description}
                        </p>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm font-medium mb-2">Requirement:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {achievement.requirement.type.replace(/_/g, ' ')} - {achievement.requirement.count}
                          </p>
                        </div>
                        {isEarned && (
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">Achievement Unlocked!</span>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No achievements found in this category.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationPanel;
