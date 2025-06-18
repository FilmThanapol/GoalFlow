import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Target, BarChart3, Award, X } from 'lucide-react';
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
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          size="icon"
        >
          <Target className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => handleAction(onOpenAnalytics)}
          className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          size="icon"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => handleAction(onOpenAchievements)}
          className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          size="icon"
        >
          <Award className="w-5 h-5" />
        </Button>
      </div>

      {/* Main FAB */}
      <Button
        onClick={toggleMenu}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110",
          isOpen 
            ? "bg-red-600 hover:bg-red-700 rotate-45" 
            : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
