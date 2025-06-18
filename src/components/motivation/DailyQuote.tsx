import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote as QuoteIcon, RefreshCw, Heart, Share } from 'lucide-react';
import { getDailyQuote, getRandomQuote, Quote } from '@/data/motivationalQuotes';
import { useToast } from '@/hooks/use-toast';

const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<Quote>(getDailyQuote());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const refreshQuote = async () => {
    setIsRefreshing(true);
    // Add a small delay for better UX
    setTimeout(() => {
      setQuote(getRandomQuote());
      setIsRefreshing(false);
      setIsLiked(false);
    }, 500);
  };

  const shareQuote = async () => {
    const shareText = `"${quote.text}" - ${quote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Motivational Quote',
          text: shareText,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Quote Copied!",
          description: "The quote has been copied to your clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Unable to share the quote.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast({
        title: "Quote Liked!",
        description: "Great choice! Keep that motivation going.",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <QuoteIcon className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              <blockquote className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                "{quote.text}"
              </blockquote>
              <div className="flex items-center justify-between">
                <cite className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  — {quote.author}
                </cite>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full capitalize">
                    {quote.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className={`${
                  isLiked 
                    ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={shareQuote}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshQuote}
                disabled={isRefreshing}
                className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                New Quote
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
