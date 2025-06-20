/*
  # Security and Compliance Implementation

  1. New Tables
    - `data_access_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `record_type` (text)
      - `record_id` (uuid)
      - `access_type` (text)
      - `accessed_at` (timestamptz)
      - `ip_address` (text)
      - `user_agent` (text)

  2. Security
    - Enable RLS on new tables
    - Add policies for audit log access
    - Add function to automatically log data access

  3. Changes
    - Add consent tracking to medical records
    - Add audit logging triggers
*/

-- Create data access logs table
CREATE TABLE IF NOT EXISTS data_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  record_type text NOT NULL,
  record_id uuid NOT NULL,
  access_type text NOT NULL CHECK (access_type IN ('view', 'create', 'update', 'delete')),
  accessed_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Enable RLS
ALTER TABLE data_access_logs ENABLE ROW LEVEL SECURITY;

-- Add consent tracking to medical records
ALTER TABLE medical_records 
ADD COLUMN IF NOT EXISTS consent_status jsonb DEFAULT '{
  "emergency_access": false,
  "data_sharing": false,
  "research_use": false
}'::jsonb,
ADD COLUMN IF NOT EXISTS consent_history jsonb DEFAULT '[]'::jsonb;

-- Create function to log data access
CREATE OR REPLACE FUNCTION log_data_access()
RETURNS TRIGGER AS $$
DECLARE
  _user_id uuid;
  _ip_address text;
  _user_agent text;
BEGIN
  -- Get current user ID from auth.uid()
  _user_id := auth.uid();
  
  -- Get client information from request.header()
  _ip_address := current_setting('request.headers', true)::jsonb->>'x-real-ip';
  _user_agent := current_setting('request.headers', true)::jsonb->>'user-agent';

  INSERT INTO data_access_logs (
    user_id,
    record_type,
    record_id,
    access_type,
    ip_address,
    user_agent
  ) VALUES (
    _user_id,
    TG_TABLE_NAME,
    NEW.id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'create'
      WHEN TG_OP = 'UPDATE' THEN 'update'
      WHEN TG_OP = 'DELETE' THEN 'delete'
      ELSE 'view'
    END,
    _ip_address,
    _user_agent
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for medical records
CREATE TRIGGER medical_records_access_log
AFTER INSERT OR UPDATE OR DELETE ON medical_records
FOR EACH ROW EXECUTE FUNCTION log_data_access();

-- Create triggers for prescriptions
CREATE TRIGGER prescriptions_access_log
AFTER INSERT OR UPDATE OR DELETE ON prescriptions
FOR EACH ROW EXECUTE FUNCTION log_data_access();

-- Create triggers for emergencies
CREATE TRIGGER emergencies_access_log
AFTER INSERT OR UPDATE OR DELETE ON emergencies
FOR EACH ROW EXECUTE FUNCTION log_data_access();

-- Policies for data access logs
CREATE POLICY "Admins can view all access logs"
ON data_access_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view their own access logs"
ON data_access_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update medical records policies
CREATE POLICY "Emergency access override"
ON medical_records
FOR SELECT
TO authenticated
USING (
  (emergency_access_enabled = true AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'doctor'
  )) OR
  (patient_id = auth.uid())
);

-- Function to update consent history
CREATE OR REPLACE FUNCTION update_consent_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.consent_status IS DISTINCT FROM NEW.consent_status THEN
    NEW.consent_history := NEW.consent_history || jsonb_build_object(
      'timestamp', extract(epoch from now()),
      'old_status', OLD.consent_status,
      'new_status', NEW.consent_status,
      'changed_by', auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for consent history
CREATE TRIGGER medical_records_consent_history
BEFORE UPDATE ON medical_records
FOR EACH ROW
WHEN (OLD.consent_status IS DISTINCT FROM NEW.consent_status)
EXECUTE FUNCTION update_consent_history();