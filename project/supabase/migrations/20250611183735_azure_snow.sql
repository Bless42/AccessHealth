/*
  # Fix doctor-user relationship

  1. Changes
    - Ensure foreign key constraint exists between doctors.user_id and auth.users.id
    - Add any missing constraints that might be causing the schema cache issue
  
  2. Security
    - Maintain existing RLS policies
*/

-- Ensure the foreign key constraint exists (this should be idempotent)
DO $$
BEGIN
  -- Check if the foreign key constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'doctors_user_id_fkey' 
    AND table_name = 'doctors'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE public.doctors 
    ADD CONSTRAINT doctors_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Refresh the schema cache by updating table comment (forces Supabase to refresh)
COMMENT ON TABLE public.doctors IS 'Doctor profiles with user relationships';