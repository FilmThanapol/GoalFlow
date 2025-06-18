
export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
  is_completed: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  theme_preference: string;
  created_at: string;
  updated_at: string;
}
