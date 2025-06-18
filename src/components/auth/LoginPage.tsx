
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Target, CheckCircle, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              GoalFlow
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Personal Goal Tracker & Roadmap Builder
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Plan your goals, track progress, and achieve success
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome to GoalFlow</CardTitle>
                <CardDescription className="text-center">
                  Sign in with Google to start tracking your goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-12 text-lg bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Free to use • Secure authentication
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20">
                <Target className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Set & Track Goals</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Create meaningful goals and break them down into actionable tasks
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Task Management</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Organize your goals with detailed task checklists and track completion
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20">
                <BarChart3 className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Progress Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Visualize your progress with beautiful charts and insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
