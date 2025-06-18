import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Goal } from '@/types/goal';
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Copy
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DataManagementProps {
  goals: Goal[];
}

const DataManagement: React.FC<DataManagementProps> = ({ goals }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        goals: goals,
        metadata: {
          totalGoals: goals.length,
          completedGoals: goals.filter(g => g.is_completed).length,
          categories: [...new Set(goals.map(g => g.category || 'general'))]
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `goalflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your goals have been exported successfully!",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      // Validate the import data structure
      if (!importData.goals || !Array.isArray(importData.goals)) {
        throw new Error('Invalid file format');
      }

      // Here you would typically call an API to import the goals
      // For now, we'll just show a success message
      toast({
        title: "Import Preview",
        description: `Found ${importData.goals.length} goals to import. Import functionality coming soon!`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import goals. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const copyBackupCode = () => {
    const backupCode = btoa(JSON.stringify(goals));
    navigator.clipboard.writeText(backupCode);
    toast({
      title: "Backup Code Copied",
      description: "Your backup code has been copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Download all your goals and tasks as a JSON file for backup or transfer.
          </p>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.is_completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={exportData} 
              disabled={isExporting || goals.length === 0}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export as JSON'}
            </Button>
            <Button 
              variant="outline" 
              onClick={copyBackupCode}
              disabled={goals.length === 0}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Backup Code
            </Button>
          </div>

          {goals.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You don't have any goals to export yet. Create some goals first!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" />
            Import Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Import goals from a previously exported JSON file or backup code.
          </p>

          <div className="space-y-3">
            <div>
              <Label htmlFor="import-file">Import from File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="mt-1"
              />
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Importing will merge with your existing goals. 
              Make sure to export your current data first as a backup.
            </AlertDescription>
          </Alert>

          {isImporting && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Processing import...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Data Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Goals</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.is_completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Completed Goals</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {new Set(goals.map(g => g.category || 'general')).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Categories Used</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy:</strong> All your data is stored locally and in your Supabase account. 
          We never access or store your personal goal data on our servers.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DataManagement;
