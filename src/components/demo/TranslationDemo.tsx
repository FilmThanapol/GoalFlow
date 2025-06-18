import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Languages, CheckCircle } from 'lucide-react';

const TranslationDemo: React.FC = () => {
  const { t, i18n } = useTranslation();

  const switchToThai = () => {
    i18n.changeLanguage('th');
  };

  const switchToEnglish = () => {
    i18n.changeLanguage('en');
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Translation Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Current Language:</strong> {i18n.language}</p>
          <p><strong>Welcome Message:</strong> {t('welcome')}</p>
          <p><strong>Create Goal:</strong> {t('createGoal')}</p>
          <p><strong>Settings:</strong> {t('settings')}</p>
          <p><strong>Analytics:</strong> {t('analytics')}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={switchToEnglish}
            variant={i18n.language === 'en' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            🇺🇸 English
            {i18n.language === 'en' && <CheckCircle className="w-4 h-4" />}
          </Button>
          <Button 
            onClick={switchToThai}
            variant={i18n.language === 'th' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            🇹🇭 ไทย
            {i18n.language === 'th' && <CheckCircle className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationDemo;
