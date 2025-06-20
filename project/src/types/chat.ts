import { User } from '@supabase/supabase-js';

export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  symptoms: string;
  ai_initial_diagnosis: string | null;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
  patient?: User;
  doctor?: User;
}

export interface ConsultationMessage {
  id: string;
  consultation_id: string;
  sender_id: string;
  content: string;
  is_ai: boolean;
  timestamp: string;
  sender?: User;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name?: string;
    role?: string;
    isAI?: boolean;
  };
  timestamp: string;
}