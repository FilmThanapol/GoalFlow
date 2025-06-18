import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate user stats
  const completedGoals = goals.filter(g => g.is_completed).length;
  const createdGoals = goals.length;
  const categoriesUsed = new Set(goals.map(g => g.category || 'general')).size;
  
  // Mock streak data (in a real app, this would come from user activity tracking)
  const currentStreak = 5;
  const longestStreak = 12;

  // Calculate earned achievements
  const earnedAchievements = achievements.filter(achievement => {
    switch (achievement.requirement.type) {
      case 'goals_completed':
        return completedGoals >= achievement.requirement.count;
      case 'goals_created':
        return createdGoals >= achievement.requirement.count;
      case 'tasks_completed':
        return completedTasks >= achievement.requirement.count;
      case 'streak_days':
        return currentStreak >= achievement.requirement.count;
      case 'categories_used':
        return categoriesUsed >= achievement.requirement.count;
      case 'special':
        // Mock some special achievements
        return Math.random() > 0.7; // 30% chance for demo
      default:
        return false;
    }
  });

  const totalPoints = earnedAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
  const userLevel = calculateUserLevel(totalPoints);

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const progressToNextLevel = userLevel.nextLevelPoints 
    ? ((totalPoints % (userLevel.nextLevelPoints / userLevel.level)) / (userLevel.nextLevelPoints / userLevel.level)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* User Level Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
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
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{earnedAchievements.length}</div>
            <p className="text-sm text-gray-600">Achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{completedGoals}</div>
            <p className="text-sm text-gray-600">Goals Done</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-sm text-gray-600">Tasks Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Achievements
            </CardTitle>
            <div className="flex gap-2">
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const isEarned = earnedAchievements.some(e => e.id === achievement.id);
              const IconComponent = achievement.icon;
              
              return (
                <Dialog key={achievement.id}>
                  <DialogTrigger asChild>
                    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isEarned ? 'ring-2 ring-yellow-300' : 'opacity-60'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${achievement.color} rounded-lg flex items-center justify-center relative`}>
                            <IconComponent className="w-5 h-5 text-white" />
                            {!isEarned && (
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <Lock className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{achievement.title}</h4>
                            <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          {isEarned && (
                            <div className="text-yellow-500">
                              <Trophy className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${achievement.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div>{achievement.title}</div>
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
                          {achievement.requirement.type.replace('_', ' ')} - {achievement.requirement.count}
                        </p>
                      </div>
                      {isEarned && (
                        <div className="flex items-center gap-2 text-green-600">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationPanel;
