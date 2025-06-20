/*
  # Add role field to profiles table

  1. Changes
    - Add role field to profiles table
    - Set default role to 'patient'
    - Update existing profiles to have default role
  2. Security
    - No changes to existing RLS policies needed
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'patient';
  END IF;
END $$;