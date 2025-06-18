import { 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Crown, 
  Award, 
  Flame, 
  CheckCircle,
  Calendar,
  TrendingUp,
  Heart,
  Rocket
} from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  category: 'goals' | 'tasks' | 'streaks' | 'special';
  requirement: {
    type: 'goals_completed' | 'goals_created' | 'tasks_completed' | 'streak_days' | 'categories_used' | 'special';
    count: number;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const achievements: Achievement[] = [
  // Goal-based achievements
  {
    id: 'first-goal',
    title: 'Getting Started',
    description: 'Create your first goal',
    icon: Target,
    color: 'bg-blue-500',
    category: 'goals',
    requirement: { type: 'goals_created', count: 1 },
    points: 10,
    rarity: 'common'
  },
  {
    id: 'goal-achiever',
    title: 'Goal Achiever',
    description: 'Complete your first goal',
    icon: CheckCircle,
    color: 'bg-green-500',
    category: 'goals',
    requirement: { type: 'goals_completed', count: 1 },
    points: 25,
    rarity: 'common'
  },
  {
    id: 'goal-master',
    title: 'Goal Master',
    description: 'Complete 5 goals',
    icon: Trophy,
    color: 'bg-yellow-500',
    category: 'goals',
    requirement: { type: 'goals_completed', count: 5 },
    points: 100,
    rarity: 'rare'
  },
  {
    id: 'goal-legend',
    title: 'Goal Legend',
    description: 'Complete 25 goals',
    icon: Crown,
    color: 'bg-purple-500',
    category: 'goals',
    requirement: { type: 'goals_completed', count: 25 },
    points: 500,
    rarity: 'legendary'
  },

  // Task-based achievements
  {
    id: 'task-starter',
    title: 'Task Starter',
    description: 'Complete 10 tasks',
    icon: CheckCircle,
    color: 'bg-blue-500',
    category: 'tasks',
    requirement: { type: 'tasks_completed', count: 10 },
    points: 50,
    rarity: 'common'
  },
  {
    id: 'task-warrior',
    title: 'Task Warrior',
    description: 'Complete 50 tasks',
    icon: Zap,
    color: 'bg-orange-500',
    category: 'tasks',
    requirement: { type: 'tasks_completed', count: 50 },
    points: 200,
    rarity: 'rare'
  },
  {
    id: 'task-champion',
    title: 'Task Champion',
    description: 'Complete 100 tasks',
    icon: Award,
    color: 'bg-red-500',
    category: 'tasks',
    requirement: { type: 'tasks_completed', count: 100 },
    points: 400,
    rarity: 'epic'
  },

  // Streak-based achievements
  {
    id: 'streak-starter',
    title: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: Flame,
    color: 'bg-orange-500',
    category: 'streaks',
    requirement: { type: 'streak_days', count: 3 },
    points: 30,
    rarity: 'common'
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    color: 'bg-red-500',
    category: 'streaks',
    requirement: { type: 'streak_days', count: 7 },
    points: 75,
    rarity: 'rare'
  },
  {
    id: 'streak-legend',
    title: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    icon: Flame,
    color: 'bg-purple-500',
    category: 'streaks',
    requirement: { type: 'streak_days', count: 30 },
    points: 300,
    rarity: 'epic'
  },

  // Special achievements
  {
    id: 'category-explorer',
    title: 'Category Explorer',
    description: 'Create goals in 5 different categories',
    icon: Star,
    color: 'bg-indigo-500',
    category: 'special',
    requirement: { type: 'categories_used', count: 5 },
    points: 150,
    rarity: 'rare'
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a goal before its deadline',
    icon: Calendar,
    color: 'bg-green-500',
    category: 'special',
    requirement: { type: 'special', count: 1 },
    points: 50,
    rarity: 'common'
  },
  {
    id: 'overachiever',
    title: 'Overachiever',
    description: 'Complete 3 goals in one day',
    icon: Rocket,
    color: 'bg-pink-500',
    category: 'special',
    requirement: { type: 'special', count: 1 },
    points: 200,
    rarity: 'epic'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a goal with all tasks finished',
    icon: Heart,
    color: 'bg-red-500',
    category: 'special',
    requirement: { type: 'special', count: 1 },
    points: 75,
    rarity: 'rare'
  }
];

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'border-gray-300 bg-gray-50 text-gray-700';
    case 'rare':
      return 'border-blue-300 bg-blue-50 text-blue-700';
    case 'epic':
      return 'border-purple-300 bg-purple-50 text-purple-700';
    case 'legendary':
      return 'border-yellow-300 bg-yellow-50 text-yellow-700';
    default:
      return 'border-gray-300 bg-gray-50 text-gray-700';
  }
};

export const calculateUserLevel = (totalPoints: number) => {
  if (totalPoints < 100) return { level: 1, title: 'Beginner', nextLevelPoints: 100 };
  if (totalPoints < 300) return { level: 2, title: 'Motivated', nextLevelPoints: 300 };
  if (totalPoints < 600) return { level: 3, title: 'Achiever', nextLevelPoints: 600 };
  if (totalPoints < 1000) return { level: 4, title: 'Goal Setter', nextLevelPoints: 1000 };
  if (totalPoints < 1500) return { level: 5, title: 'Champion', nextLevelPoints: 1500 };
  if (totalPoints < 2500) return { level: 6, title: 'Master', nextLevelPoints: 2500 };
  if (totalPoints < 4000) return { level: 7, title: 'Expert', nextLevelPoints: 4000 };
  if (totalPoints < 6000) return { level: 8, title: 'Legend', nextLevelPoints: 6000 };
  if (totalPoints < 10000) return { level: 9, title: 'Grandmaster', nextLevelPoints: 10000 };
  return { level: 10, title: 'Ultimate Goal Crusher', nextLevelPoints: null };
};
