import { 
  Dumbbell, 
  BookOpen, 
  Briefcase, 
  Heart, 
  DollarSign, 
  Plane, 
  Home, 
  Users,
  Target,
  Lightbulb,
  Camera,
  Music
} from 'lucide-react';

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  tasks: string[];
  estimatedDuration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const goalTemplates: GoalTemplate[] = [
  {
    id: 'fitness-weight-loss',
    title: 'Lose 20 pounds',
    description: 'A comprehensive weight loss plan with diet and exercise',
    category: 'fitness',
    icon: Dumbbell,
    color: 'bg-red-500',
    estimatedDuration: '3-6 months',
    difficulty: 'Medium',
    tasks: [
      'Set up a workout schedule (3-4 times per week)',
      'Plan healthy meal prep for the week',
      'Track daily calorie intake',
      'Drink 8 glasses of water daily',
      'Get 7-8 hours of sleep each night',
      'Take progress photos weekly',
      'Schedule monthly check-ins with a trainer or nutritionist'
    ]
  },
  {
    id: 'career-promotion',
    title: 'Get promoted to senior position',
    description: 'Advance your career with strategic skill development',
    category: 'career',
    icon: Briefcase,
    color: 'bg-blue-500',
    estimatedDuration: '6-12 months',
    difficulty: 'Hard',
    tasks: [
      'Identify key skills needed for promotion',
      'Complete relevant online courses or certifications',
      'Schedule monthly one-on-ones with manager',
      'Take on high-visibility projects',
      'Build relationships with senior colleagues',
      'Document achievements and impact',
      'Request feedback and create improvement plan'
    ]
  },
  {
    id: 'learning-new-language',
    title: 'Learn Spanish fluently',
    description: 'Master conversational Spanish in 6 months',
    category: 'learning',
    icon: BookOpen,
    color: 'bg-green-500',
    estimatedDuration: '6-12 months',
    difficulty: 'Medium',
    tasks: [
      'Download language learning app (Duolingo, Babbel)',
      'Practice 30 minutes daily',
      'Watch Spanish movies with subtitles',
      'Find a conversation partner or tutor',
      'Join local Spanish speaking groups',
      'Read Spanish news articles weekly',
      'Take a proficiency test after 6 months'
    ]
  },
  {
    id: 'financial-emergency-fund',
    title: 'Build $10,000 emergency fund',
    description: 'Create financial security with a solid emergency fund',
    category: 'finance',
    icon: DollarSign,
    color: 'bg-yellow-500',
    estimatedDuration: '12-18 months',
    difficulty: 'Medium',
    tasks: [
      'Calculate monthly expenses and set savings target',
      'Open high-yield savings account',
      'Set up automatic transfers',
      'Track expenses and identify areas to cut',
      'Find additional income sources',
      'Review and adjust budget monthly',
      'Celebrate milestones ($2.5k, $5k, $7.5k)'
    ]
  },
  {
    id: 'health-meditation',
    title: 'Establish daily meditation practice',
    description: 'Reduce stress and improve mental health through meditation',
    category: 'health',
    icon: Heart,
    color: 'bg-purple-500',
    estimatedDuration: '2-3 months',
    difficulty: 'Easy',
    tasks: [
      'Download meditation app (Headspace, Calm)',
      'Start with 5 minutes daily',
      'Create a quiet meditation space',
      'Set consistent daily time',
      'Gradually increase to 20 minutes',
      'Try different meditation styles',
      'Track mood and stress levels'
    ]
  },
  {
    id: 'travel-europe',
    title: 'Plan and take European vacation',
    description: 'Organize a memorable 2-week trip to Europe',
    category: 'travel',
    icon: Plane,
    color: 'bg-indigo-500',
    estimatedDuration: '3-6 months',
    difficulty: 'Medium',
    tasks: [
      'Research destinations and create itinerary',
      'Set travel budget and start saving',
      'Book flights and accommodations',
      'Apply for necessary visas/documents',
      'Research local customs and basic phrases',
      'Plan activities and book tours',
      'Pack and prepare for departure'
    ]
  },
  {
    id: 'home-organization',
    title: 'Declutter and organize entire home',
    description: 'Create a clean, organized living space using Marie Kondo method',
    category: 'lifestyle',
    icon: Home,
    color: 'bg-teal-500',
    estimatedDuration: '2-4 months',
    difficulty: 'Easy',
    tasks: [
      'Start with one room at a time',
      'Sort items: keep, donate, discard',
      'Organize storage solutions',
      'Create designated spaces for everything',
      'Establish daily tidying routine',
      'Donate or sell unwanted items',
      'Maintain organization system'
    ]
  },
  {
    id: 'social-networking',
    title: 'Expand professional network',
    description: 'Build meaningful professional relationships',
    category: 'career',
    icon: Users,
    color: 'bg-pink-500',
    estimatedDuration: '6-12 months',
    difficulty: 'Medium',
    tasks: [
      'Update LinkedIn profile',
      'Attend 2 networking events per month',
      'Reach out to 5 new connections weekly',
      'Join professional associations',
      'Offer help and value to connections',
      'Schedule coffee chats with industry peers',
      'Follow up consistently with new contacts'
    ]
  },
  {
    id: 'creative-photography',
    title: 'Master photography skills',
    description: 'Develop advanced photography techniques and build portfolio',
    category: 'creative',
    icon: Camera,
    color: 'bg-orange-500',
    estimatedDuration: '6-9 months',
    difficulty: 'Medium',
    tasks: [
      'Learn camera basics and manual mode',
      'Practice composition techniques',
      'Take photos daily for 30 days',
      'Study work of professional photographers',
      'Join photography community or club',
      'Create and curate portfolio',
      'Consider selling prints or offering services'
    ]
  },
  {
    id: 'skill-music',
    title: 'Learn to play guitar',
    description: 'Master basic guitar skills and play favorite songs',
    category: 'creative',
    icon: Music,
    color: 'bg-cyan-500',
    estimatedDuration: '6-12 months',
    difficulty: 'Medium',
    tasks: [
      'Purchase or rent a guitar',
      'Learn basic chords (G, C, D, Em, Am)',
      'Practice 30 minutes daily',
      'Use online tutorials or take lessons',
      'Learn to read tabs',
      'Master 5 favorite songs',
      'Play for friends or family'
    ]
  }
];

export const categories = [
  { name: 'fitness', label: 'Fitness & Health', color: 'bg-red-500', icon: Dumbbell },
  { name: 'career', label: 'Career & Business', color: 'bg-blue-500', icon: Briefcase },
  { name: 'learning', label: 'Learning & Education', color: 'bg-green-500', icon: BookOpen },
  { name: 'finance', label: 'Finance & Money', color: 'bg-yellow-500', icon: DollarSign },
  { name: 'health', label: 'Mental Health', color: 'bg-purple-500', icon: Heart },
  { name: 'travel', label: 'Travel & Adventure', color: 'bg-indigo-500', icon: Plane },
  { name: 'lifestyle', label: 'Lifestyle & Home', color: 'bg-teal-500', icon: Home },
  { name: 'creative', label: 'Creative & Hobbies', color: 'bg-orange-500', icon: Lightbulb },
  { name: 'general', label: 'General', color: 'bg-gray-500', icon: Target }
];
