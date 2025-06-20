import { User } from '@supabase/supabase-js';

export interface MedicalRecord {
  id: string;
  patient_id: string;
  blood_type: string | null;
  allergies: Array<{
    name: string;
    severity: 'mild' | 'moderate' | 'severe';
    notes?: string;
  }>;
  chronic_conditions: Array<{
    name: string;
    diagnosed_date: string;
    status: 'active' | 'managed' | 'resolved';
    notes?: string;
  }>;
  vaccinations: Array<{
    name: string;
    date: string;
    provider?: string;
    next_due?: string;
  }>;
  emergency_access_enabled: boolean;
  consent_status: {
    emergency_access: boolean;
    data_sharing: boolean;
    research_use: boolean;
  };
  consent_history: Array<{
    timestamp: number;
    old_status: Record<string, boolean>;
    new_status: Record<string, boolean>;
    changed_by: string;
  }>;
  last_updated: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export interface MedicalRecordAudit {
  id: string;
  record_id: string;
  changed_by: string;
  changed_at: string;
  old_data: Partial<MedicalRecord>;
  new_data: Partial<MedicalRecord>;
}

export interface DataAccessLog {
  id: string;
  user_id: string;
  record_type: string;
  record_id: string;
  access_type: 'view' | 'create' | 'update' | 'delete';
  accessed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  user?: User;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';