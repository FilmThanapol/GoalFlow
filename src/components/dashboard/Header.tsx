
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Target, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import LanguageSwitcher from '@/components/ui/language-switcher';

const Header = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 border-b border-pink-200 dark:border-purple-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('goalflow')}
              </h1>
              <div className="flex items-center gap-1">
                <span className="text-xs">✨</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">cute & productive</span>
                <span className="text-xs">🌸</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-600" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/20">
                  <Avatar className="h-10 w-10 ring-2 ring-pink-200 dark:ring-purple-700">
                    <AvatarImage 
                      src={user?.user_metadata?.avatar_url} 
                      alt={user?.user_metadata?.full_name || 'User'} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white font-semibold">
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-pink-200 dark:border-purple-700" align="end">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-pink-50 dark:hover:bg-pink-900/20">
                  <Settings className="w-4 h-4 mr-2" />
                  {t('settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="hover:bg-pink-50 dark:hover:bg-pink-900/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
