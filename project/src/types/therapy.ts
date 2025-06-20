export interface TherapySpecialty {
  id: string;
  name: string;
  description: string;
  category: 'addiction' | 'relationships' | 'depression' | 'anxiety' | 'trauma' | 'family' | 'couples' | 'grief';
  created_at: string;
}

export interface Therapist {
  id: string;
  user_id: string;
  license_number: string;
  years_experience: number;
  education: string;
  bio: string;
  session_fee: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_available: boolean;
  therapy_types: string[]; // individual, group, couples, family
  languages: string[];
  location_lat?: number;
  location_lng?: number;
  address?: string;
  specialties?: TherapySpecialty[];
  user?: any;
  created_at: string;
  updated_at: string;
}

export interface TherapySession {
  id: string;
  patient_id: string;
  therapist_id: string;
  session_date: string;
  duration_minutes: number;
  session_type: 'individual' | 'group' | 'couples' | 'family';
  format: 'virtual' | 'in_person';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  homework_assigned?: string;
  progress_rating?: number; // 1-10 scale
  mood_before?: number; // 1-10 scale
  mood_after?: number; // 1-10 scale
  goals_discussed?: string[];
  next_session_goals?: string[];
  created_at: string;
  updated_at: string;
}

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: 'addiction' | 'depression' | 'anxiety' | 'grief' | 'relationships' | 'trauma' | 'chronic_illness';
  facilitator_id: string;
  max_participants: number;
  current_participants: number;
  meeting_schedule: {
    day_of_week: number;
    time: string;
    duration_minutes: number;
  };
  is_virtual: boolean;
  meeting_link?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportGroupMembership {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  is_active: boolean;
  role: 'member' | 'moderator';
}

export interface TherapyProgress {
  id: string;
  patient_id: string;
  therapist_id: string;
  session_id: string;
  progress_date: string;
  mood_rating: number; // 1-10
  anxiety_level: number; // 1-10
  depression_level: number; // 1-10
  sleep_quality: number; // 1-10
  energy_level: number; // 1-10
  social_interaction: number; // 1-10
  goal_progress: {
    goal: string;
    progress_percentage: number;
    notes?: string;
  }[];
  challenges_faced: string[];
  achievements: string[];
  therapist_notes?: string;
  next_session_focus?: string[];
  created_at: string;
}