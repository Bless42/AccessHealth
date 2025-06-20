/*
  # Medical Records System Implementation

  1. New Tables
    - `medical_records`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references users)
      - `blood_type` (text)
      - `allergies` (jsonb)
      - `chronic_conditions` (jsonb)
      - `vaccinations` (jsonb)
      - `last_updated` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `updated_by` (uuid, references users)

  2. Security
    - Enable RLS on medical_records table
    - Add policies for patients to view their own records
    - Add policies for doctors to view and edit assigned patients' records
    - Add audit trail for changes
*/

-- Create medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blood_type text,
  allergies jsonb DEFAULT '[]'::jsonb,
  chronic_conditions jsonb DEFAULT '[]'::jsonb,
  vaccinations jsonb DEFAULT '[]'::jsonb,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Create audit trail table for medical records
CREATE TABLE IF NOT EXISTS medical_records_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id uuid REFERENCES medical_records(id) ON DELETE CASCADE NOT NULL,
  changed_by uuid REFERENCES auth.users(id) NOT NULL,
  changed_at timestamptz DEFAULT now(),
  old_data jsonb,
  new_data jsonb
);

-- Enable RLS on audit trail
ALTER TABLE medical_records_audit ENABLE ROW LEVEL SECURITY;

-- Function to record changes in audit trail
CREATE OR REPLACE FUNCTION log_medical_record_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO medical_records_audit (
    record_id,
    changed_by,
    old_data,
    new_data
  ) VALUES (
    NEW.id,
    NEW.updated_by,
    row_to_json(OLD)::jsonb,
    row_to_json(NEW)::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for audit trail
CREATE TRIGGER medical_records_audit_trigger
  AFTER UPDATE ON medical_records
  FOR EACH ROW
  EXECUTE FUNCTION log_medical_record_changes();

-- Policies for medical_records table

-- Patients can view their own records
CREATE POLICY "Patients can view own medical records"
  ON medical_records
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = patient_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'doctor'
    )
  );

-- Only doctors can insert records
CREATE POLICY "Doctors can create medical records"
  ON medical_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'doctor'
    )
  );

-- Only doctors can update records
CREATE POLICY "Doctors can update medical records"
  ON medical_records
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

-- Policies for medical_records_audit table

-- Doctors and patients can view audit trail
CREATE POLICY "View audit trail"
  ON medical_records_audit
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM medical_records
      WHERE medical_records.id = medical_records_audit.record_id
      AND (
        medical_records.patient_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE user_id = auth.uid()
          AND role = 'doctor'
        )
      )
    )
  );