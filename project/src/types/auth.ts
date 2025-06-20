export type UserRole = 'patient' | 'doctor' | 'admin';

export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  phone_number: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}