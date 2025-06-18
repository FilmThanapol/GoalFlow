
import React from 'react';
import { Goal } from '@/types/goal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useNotifications } from '@/hooks/useNotifications';

interface GoalCardProps {
  goal: Goal;
  completedTasks: number;
  totalTasks: number;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onToggleFavorite: (goalId: string, isFavorite: boolean) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  completedTasks,
  totalTasks,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isCompleted = goal.is_completed || progress === 100;
  const { getGoalStatus, getStatusColor, getStatusText } = useNotifications([goal]);
  const goalStatus = getGoalStatus(goal);

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      finance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      career: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      education: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      personal: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isCompleted ? 'ring-2 ring-green-200 dark:ring-green-800' : ''
    } ${goal.is_favorite ? 'ring-2 ring-yellow-200 dark:ring-yellow-800' : ''} ${
      goalStatus === 'overdue' ? 'ring-2 ring-red-300 dark:ring-red-700' : ''
    } ${goalStatus === 'due-today' ? 'ring-2 ring-orange-300 dark:ring-orange-700' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className={`text-lg ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                {goal.title}
              </CardTitle>
              {goal.is_favorite && (
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              )}
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </div>
            <Badge className={getCategoryColor(goal.category || 'general')}>
              {goal.category || 'general'}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(goal)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onToggleFavorite(goal.id, !goal.is_favorite)}
              >
                <Star className="w-4 h-4 mr-2" />
                {goal.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(goal.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {goal.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {goal.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="font-medium transition-all duration-300">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <Progress
            value={progress}
            className="h-2 transition-all duration-500 ease-out"
          />
          <div className="text-xs text-gray-500 transition-all duration-300">
            {Math.round(progress)}% complete
            {progress === 100 && (
              <span className="ml-2 text-green-600 animate-pulse">🎉</span>
            )}
          </div>
        </div>
        
        {goal.target_date && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>Due: {format(new Date(goal.target_date), 'MMM dd, yyyy')}</span>
            </div>
            {goalStatus !== 'no-deadline' && goalStatus !== 'completed' && (
              <Badge className={`text-xs ${getStatusColor(goalStatus)}`}>
                {goalStatus === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {goalStatus === 'due-today' && <Clock className="w-3 h-3 mr-1" />}
                {getStatusText(goalStatus, goal)}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
