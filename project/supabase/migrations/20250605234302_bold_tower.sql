/*
  # Create AI Chat Consultation System

  1. New Tables
    - `consultations`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references auth.users)
      - `doctor_id` (uuid, references auth.users, nullable)
      - `symptoms` (text)
      - `ai_initial_diagnosis` (text)
      - `status` (text: pending/active/completed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `consultation_messages`
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `sender_id` (uuid, references auth.users)
      - `content` (text)
      - `is_ai` (boolean)
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for patients and doctors
*/

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  symptoms text NOT NULL,
  ai_initial_diagnosis text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultation messages table
CREATE TABLE IF NOT EXISTS consultation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_ai boolean DEFAULT false,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_messages ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger for consultations
CREATE TRIGGER set_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Policies for consultations
CREATE POLICY "Patients can view their own consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view assigned consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = doctor_id OR
    (doctor_id IS NULL AND EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'doctor'
    ))
  );

CREATE POLICY "Patients can create consultations"
  ON consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = patient_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'patient'
    )
  );

CREATE POLICY "Doctors can update consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'doctor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'doctor'
    )
  );

-- Policies for consultation messages
CREATE POLICY "Users can view messages from their consultations"
  ON consultation_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultations
      WHERE consultations.id = consultation_id
      AND (
        patient_id = auth.uid() OR
        doctor_id = auth.uid() OR
        (doctor_id IS NULL AND EXISTS (
          SELECT 1 FROM profiles
          WHERE user_id = auth.uid()
          AND role = 'doctor'
        ))
      )
    )
  );

CREATE POLICY "Users can send messages to their consultations"
  ON consultation_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM consultations
      WHERE consultations.id = consultation_id
      AND (
        patient_id = auth.uid() OR
        doctor_id = auth.uid() OR
        (doctor_id IS NULL AND EXISTS (
          SELECT 1 FROM profiles
          WHERE user_id = auth.uid()
          AND role = 'doctor'
        ))
      )
    )
  );