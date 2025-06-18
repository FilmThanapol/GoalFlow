export interface Quote {
  text: string;
  author: string;
  category: 'motivation' | 'success' | 'perseverance' | 'goals' | 'growth';
}

export const motivationalQuotes: Quote[] = [
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "goals"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "perseverance"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "perseverance"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "motivation"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "success"
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "goals"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    category: "motivation"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "perseverance"
  },
  {
    text: "Success is not how high you have climbed, but how you make a positive difference to the world.",
    author: "Roy T. Bennett",
    category: "success"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "goals"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "perseverance"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill",
    category: "success"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "perseverance"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "motivation"
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    category: "motivation"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "growth"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "goals"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
    category: "success"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown",
    category: "motivation"
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Unknown",
    category: "goals"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown",
    category: "perseverance"
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown",
    category: "motivation"
  },
  {
    text: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery",
    category: "growth"
  },
  {
    text: "Little things make big days.",
    author: "Unknown",
    category: "motivation"
  },
  {
    text: "It's going to be hard, but hard does not mean impossible.",
    author: "Unknown",
    category: "perseverance"
  },
  {
    text: "Don't wait for opportunity. Create it.",
    author: "Unknown",
    category: "success"
  },
  {
    text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    author: "Unknown",
    category: "growth"
  },
  {
    text: "The key to success is to focus on goals, not obstacles.",
    author: "Unknown",
    category: "goals"
  }
];

export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

export const getQuoteByCategory = (category: Quote['category']): Quote => {
  const categoryQuotes = motivationalQuotes.filter(quote => quote.category === category);
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex] || getRandomQuote();
};

export const getDailyQuote = (): Quote => {
  // Use date as seed for consistent daily quote
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(seed) % motivationalQuotes.length;
  return motivationalQuotes[index];
};
