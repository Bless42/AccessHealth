import { User } from '@supabase/supabase-js';

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  location?: string;
}

export interface ConsultationSession {
  id: string;
  user_id: string;
  symptoms: Symptom[];
  assessment: string;
  recommendation: string;
  triage_level: 'low' | 'medium' | 'high' | 'emergency';
  created_at: string;
  language: string;
  user?: User;
}

export interface BodyLocation {
  x: number;
  y: number;
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  language: string;
}

export interface DoctorSpecialty {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  license_number: string;
  years_experience: number;
  education: string;
  bio: string;
  consultation_fee: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_available: boolean;
  location_lat?: number;
  location_lng?: number;
  address?: string;
  created_at: string;
  updated_at: string;
  specialties?: DoctorSpecialty[];
  user?: {
    email: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  };
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0 = Sunday
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  consultation_id?: string;
  appointment_date: string;
  duration_minutes: number;
  type: 'virtual' | 'in_person';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
  patient?: {
    email: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  };
}

export interface Payment {
  id: string;
  patient_id: string;
  doctor_id?: string;
  appointment_id?: string;
  consultation_id?: string;
  amount: number;
  currency: string;
  payment_method: 'card' | 'bank_transfer' | 'wallet' | 'insurance';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_provider?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface VideoSession {
  id: string;
  appointment_id: string;
  session_id: string;
  room_url?: string;
  recording_url?: string;
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  participants: any[];
  status: 'created' | 'active' | 'ended' | 'failed';
  created_at: string;
}

export interface DoctorReview {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  rating: number;
  review_text?: string;
  is_anonymous: boolean;
  created_at: string;
  patient?: User;
}

export interface DoctorSearchFilters {
  specialty?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in kilometers
  };
  availability?: {
    date: string;
    time?: string;
  };
  rating?: number;
  maxFee?: number;
  consultationType?: 'virtual' | 'in_person';
}