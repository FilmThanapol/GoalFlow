
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Target, BarChart3, Award, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onCreateGoal: () => void;
  onOpenAnalytics: () => void;
  onOpenAchievements: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onCreateGoal,
  onOpenAnalytics,
  onOpenAchievements,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-3 transition-all duration-300 transform",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
      )}>
        <Button
          onClick={() => handleAction(onCreateGoal)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border-2 border-white dark:border-gray-800"
          size="icon"
        >
          <Target className="w-6 h-6" />
        </Button>
        
        <Button
          onClick={() => handleAction(onOpenAnalytics)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border-2 border-white dark:border-gray-800"
          size="icon"
        >
          <BarChart3 className="w-6 h-6" />
        </Button>
        
        <Button
          onClick={() => handleAction(onOpenAchievements)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border-2 border-white dark:border-gray-800"
          size="icon"
        >
          <Award className="w-6 h-6" />
        </Button>
      </div>

      {/* Main FAB */}
      <Button
        onClick={toggleMenu}
        className={cn(
          "w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white dark:border-gray-800",
          isOpen 
            ? "bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 rotate-45" 
            : "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <div className="relative">
            <Plus className="w-7 h-7" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-pink-200 animate-pulse" />
          </div>
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
