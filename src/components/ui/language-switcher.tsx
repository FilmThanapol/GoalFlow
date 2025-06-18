
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-colors"
        >
          <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-pink-200 dark:border-pink-800">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={`cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 ${
            i18n.language === 'en' ? 'bg-pink-100 dark:bg-pink-900/30' : ''
          }`}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('th')}
          className={`cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 ${
            i18n.language === 'th' ? 'bg-pink-100 dark:bg-pink-900/30' : ''
          }`}
        >
          🇹🇭 ไทย
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
