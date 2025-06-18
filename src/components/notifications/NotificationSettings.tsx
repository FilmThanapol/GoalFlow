import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Goal } from '@/types/goal';

interface NotificationSettingsProps {
  goals: Goal[];
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ goals }) => {
  const { permission, requestPermission } = useNotifications(goals);

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: 'Notifications enabled',
          color: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'denied':
        return {
          icon: <BellOff className="w-4 h-4 text-red-600" />,
          text: 'Notifications blocked',
          color: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
          text: 'Permission needed',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
    }
  };

  const status = getPermissionStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Browser Notifications</Label>
            <p className="text-xs text-gray-500">
              Get notified about upcoming deadlines and overdue goals
            </p>
          </div>
          <Badge className={status.color}>
            {status.icon}
            <span className="ml-1">{status.text}</span>
          </Badge>
        </div>

        {permission !== 'granted' && (
          <Button 
            onClick={requestPermission}
            className="w-full"
            variant={permission === 'denied' ? 'outline' : 'default'}
          >
            <Bell className="w-4 h-4 mr-2" />
            {permission === 'denied' 
              ? 'Enable in browser settings' 
              : 'Enable Notifications'
            }
          </Button>
        )}

        {permission === 'granted' && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-medium">Notification Types</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Due Today</Label>
                  <p className="text-xs text-gray-500">Goals due today</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Due Tomorrow</Label>
                  <p className="text-xs text-gray-500">Goals due tomorrow</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Due This Week</Label>
                  <p className="text-xs text-gray-500">Goals due within 7 days</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Overdue</Label>
                  <p className="text-xs text-gray-500">Goals past their deadline</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        )}

        {permission === 'denied' && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-300">
              Notifications are blocked. To enable them:
            </p>
            <ol className="text-xs text-red-600 dark:text-red-400 mt-1 ml-4 list-decimal">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Set notifications to "Allow"</li>
              <li>Refresh the page</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
