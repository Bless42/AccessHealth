/*
  # Enhanced Consultation System

  1. New Tables
    - `doctors` - Doctor profiles with specialties and availability
    - `appointments` - Scheduled appointments between patients and doctors
    - `doctor_specialties` - Available medical specialties
    - `doctor_availability` - Doctor availability schedules
    - `payments` - Payment records for consultations
    - `video_sessions` - Virtual consultation session data

  2. Updates to existing tables
    - Add payment and video session references to consultations

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for patients, doctors, and admins
*/

-- Create specialties table
CREATE TABLE IF NOT EXISTS doctor_specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create doctors table (extends profiles for doctors)
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  license_number text UNIQUE,
  years_experience integer DEFAULT 0,
  education text,
  bio text,
  consultation_fee numeric(10,2) DEFAULT 0,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_available boolean DEFAULT true,
  location_lat double precision,
  location_lng double precision,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor specialty junction table
CREATE TABLE IF NOT EXISTS doctor_specialty_junction (
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  specialty_id uuid REFERENCES doctor_specialties(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, specialty_id)
);

-- Create doctor availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  consultation_id uuid REFERENCES consultations(id) ON DELETE SET NULL,
  appointment_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  type text NOT NULL DEFAULT 'virtual' CHECK (type IN ('virtual', 'in_person')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes text,
  reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  consultation_id uuid REFERENCES consultations(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text NOT NULL CHECK (payment_method IN ('card', 'bank_transfer', 'wallet', 'insurance')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_provider text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video sessions table
CREATE TABLE IF NOT EXISTS video_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
  session_id text UNIQUE NOT NULL,
  room_url text,
  recording_url text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  participants jsonb DEFAULT '[]',
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'active', 'ended', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Create doctor reviews table
CREATE TABLE IF NOT EXISTS doctor_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(patient_id, appointment_id)
);

-- Enable RLS on all tables
ALTER TABLE doctor_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_specialty_junction ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_reviews ENABLE ROW LEVEL SECURITY;

-- Add triggers for updated_at
CREATE TRIGGER set_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Insert default specialties
INSERT INTO doctor_specialties (name, description) VALUES
  ('General Practice', 'Primary care and general medical services'),
  ('Cardiology', 'Heart and cardiovascular system'),
  ('Dermatology', 'Skin, hair, and nail conditions'),
  ('Endocrinology', 'Hormones and metabolic disorders'),
  ('Gastroenterology', 'Digestive system disorders'),
  ('Neurology', 'Nervous system disorders'),
  ('Orthopedics', 'Musculoskeletal system'),
  ('Pediatrics', 'Medical care for children'),
  ('Psychiatry', 'Mental health and behavioral disorders'),
  ('Radiology', 'Medical imaging and diagnostics')
ON CONFLICT (name) DO NOTHING;

-- RLS Policies

-- Doctor specialties (public read)
CREATE POLICY "Anyone can view specialties"
  ON doctor_specialties
  FOR SELECT
  TO authenticated
  USING (true);

-- Doctors table policies
CREATE POLICY "Anyone can view verified doctors"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE POLICY "Doctors can view and update own profile"
  ON doctors
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Doctors can insert own profile"
  ON doctors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'doctor'
    )
  );

-- Doctor specialty junction policies
CREATE POLICY "Anyone can view doctor specialties"
  ON doctor_specialty_junction
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can manage own specialties"
  ON doctor_specialty_junction
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_id AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_id AND doctors.user_id = auth.uid()
    )
  );

-- Doctor availability policies
CREATE POLICY "Anyone can view doctor availability"
  ON doctor_availability
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can manage own availability"
  ON doctor_availability
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_id AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_id AND doctors.user_id = auth.uid()
    )
  );

-- Appointments policies
CREATE POLICY "Users can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_id AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    patient_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'patient'
    )
  );

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_id AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_id AND doctors.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_id AND doctors.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Patients can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    patient_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'patient'
    )
  );

CREATE POLICY "System can update payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Video sessions policies
CREATE POLICY "Appointment participants can view sessions"
  ON video_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_id
      AND (
        appointments.patient_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM doctors
          WHERE doctors.id = appointments.doctor_id AND doctors.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Doctors can manage video sessions"
  ON video_sessions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      JOIN doctors ON doctors.id = appointments.doctor_id
      WHERE appointments.id = appointment_id AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      JOIN doctors ON doctors.id = appointments.doctor_id
      WHERE appointments.id = appointment_id AND doctors.user_id = auth.uid()
    )
  );

-- Doctor reviews policies
CREATE POLICY "Anyone can view non-anonymous reviews"
  ON doctor_reviews
  FOR SELECT
  TO authenticated
  USING (is_anonymous = false OR patient_id = auth.uid());

CREATE POLICY "Patients can create reviews"
  ON doctor_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    patient_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'patient'
    )
  );

CREATE POLICY "Patients can update own reviews"
  ON doctor_reviews
  FOR UPDATE
  TO authenticated
  USING (patient_id = auth.uid())
  WITH CHECK (patient_id = auth.uid());

-- Add consultation payment and video session references
ALTER TABLE consultations 
ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES payments(id),
ADD COLUMN IF NOT EXISTS video_session_id uuid REFERENCES video_sessions(id);

-- Function to update doctor rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM doctor_reviews 
      WHERE doctor_id = COALESCE(NEW.doctor_id, OLD.doctor_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM doctor_reviews 
      WHERE doctor_id = COALESCE(NEW.doctor_id, OLD.doctor_id)
    )
  WHERE id = COALESCE(NEW.doctor_id, OLD.doctor_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update doctor rating
CREATE TRIGGER update_doctor_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON doctor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_doctor_rating();