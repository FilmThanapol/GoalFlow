import { useEffect, useState } from 'react';
import { Goal } from '@/types/goal';

export const useNotifications = (goals: Goal[]) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  };

  const checkDeadlines = () => {
    if (permission !== 'granted') return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    goals.forEach((goal) => {
      if (!goal.target_date || goal.is_completed) return;

      const targetDate = new Date(goal.target_date);
      const daysUntilDeadline = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Notify for goals due tomorrow
      if (daysUntilDeadline === 1) {
        sendNotification(`Goal Due Tomorrow: ${goal.title}`, {
          body: 'Don\'t forget to work on this goal!',
          tag: `goal-${goal.id}-tomorrow`,
        });
      }
      
      // Notify for goals due in a week
      if (daysUntilDeadline === 7) {
        sendNotification(`Goal Due Next Week: ${goal.title}`, {
          body: 'You have one week left to complete this goal.',
          tag: `goal-${goal.id}-week`,
        });
      }
      
      // Notify for overdue goals
      if (daysUntilDeadline < 0) {
        sendNotification(`Overdue Goal: ${goal.title}`, {
          body: `This goal was due ${Math.abs(daysUntilDeadline)} days ago.`,
          tag: `goal-${goal.id}-overdue`,
        });
      }
    });
  };

  const getGoalStatus = (goal: Goal) => {
    if (!goal.target_date) return 'no-deadline';
    if (goal.is_completed) return 'completed';

    const now = new Date();
    const targetDate = new Date(goal.target_date);
    const daysUntilDeadline = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline < 0) return 'overdue';
    if (daysUntilDeadline === 0) return 'due-today';
    if (daysUntilDeadline <= 3) return 'due-soon';
    if (daysUntilDeadline <= 7) return 'due-this-week';
    return 'on-track';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'due-today':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'due-soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'due-this-week':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string, goal: Goal) => {
    if (!goal.target_date) return '';
    
    const targetDate = new Date(goal.target_date);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    switch (status) {
      case 'overdue':
        return `Overdue by ${Math.abs(daysUntilDeadline)} day${Math.abs(daysUntilDeadline) === 1 ? '' : 's'}`;
      case 'due-today':
        return 'Due today';
      case 'due-soon':
        return `Due in ${daysUntilDeadline} day${daysUntilDeadline === 1 ? '' : 's'}`;
      case 'due-this-week':
        return `Due in ${daysUntilDeadline} days`;
      case 'completed':
        return 'Completed';
      default:
        return `${daysUntilDeadline} days left`;
    }
  };

  // Set up periodic deadline checking
  useEffect(() => {
    if (permission === 'granted') {
      // Check immediately
      checkDeadlines();
      
      // Check every hour
      const interval = setInterval(checkDeadlines, 60 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [goals, permission]);

  return {
    permission,
    requestPermission,
    sendNotification,
    checkDeadlines,
    getGoalStatus,
    getStatusColor,
    getStatusText,
  };
};
