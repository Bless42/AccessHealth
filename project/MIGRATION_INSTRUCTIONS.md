# Migration Instructions

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the ENTIRE contents of the migration file below into the SQL Editor
4. Click "Run" to execute the migration

```sql
/*
  # Create user profiles table with role support

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users.id)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `phone_number` (text)
      - `address` (text)
      - `role` (text, default 'patient')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `profiles` table
    - Add policy for authenticated users to read and update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name text,
  last_name text,
  date_of_birth date,
  phone_number text,
  address text,
  role text DEFAULT 'patient',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a trigger to set updated_at on update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create policy for users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create a function to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role)
  VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

5. After running the migration, verify that:
   - The `profiles` table exists in the public schema
   - The `role` column is present in the profiles table
   - Row Level Security (RLS) is enabled
   - The policies are correctly applied
   - The triggers are created

6. Restart your application's development server to ensure the changes take effect