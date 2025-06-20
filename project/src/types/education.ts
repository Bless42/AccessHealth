export interface HealthContent {
  id: string;
  title: string;
  content: string;
  content_type: 'article' | 'video' | 'infographic' | 'tip';
  category: 'nutrition' | 'exercise' | 'mental_health' | 'preventive_care' | 'chronic_disease' | 'emergency_care';
  tags: string[];
  author_id?: string;
  featured_image?: string;
  video_url?: string;
  reading_time?: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_published: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface PreventiveCareReminder {
  id: string;
  user_id: string;
  reminder_type: 'vaccination' | 'checkup' | 'screening' | 'medication' | 'exercise' | 'diet';
  title: string;
  description: string;
  due_date: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  is_completed: boolean;
  completed_at?: string;
  next_due_date?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  estimated_time: number; // in minutes
  benefits: string[];
  created_at: string;
}