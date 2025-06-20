/*
  # Emergency Response System

  1. New Tables
    - `emergencies`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references auth.users)
      - `location_lat` (double precision)
      - `location_lng` (double precision)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `resolved_at` (timestamptz)
      - `resolved_by` (uuid)
      - `notes` (text)
  2. Security
    - Enable RLS on emergencies table
    - Add policies for patients and doctors
*/

CREATE TABLE IF NOT EXISTS emergencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  notes text
);

ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- Policies for emergencies table
CREATE POLICY "Patients can view their own emergencies"
  ON emergencies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create emergencies"
  ON emergencies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can view all emergencies"
  ON emergencies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'doctor'
    )
  );

CREATE POLICY "Doctors can update emergencies"
  ON emergencies
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

-- Create updated_at trigger
CREATE TRIGGER set_emergencies_updated_at
  BEFORE UPDATE ON emergencies
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();