/*
  # Add emergency access support to medical records

  1. Changes
    - Add emergency_access_enabled column to medical_records table
    - Set default value to false for security
    - Update existing records to have emergency access disabled
  2. Security
    - No changes to existing RLS policies needed as the column is protected by existing policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'medical_records' 
    AND column_name = 'emergency_access_enabled'
  ) THEN
    ALTER TABLE medical_records 
    ADD COLUMN emergency_access_enabled boolean DEFAULT false;
  END IF;
END $$;