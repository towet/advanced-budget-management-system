/*
  # Initial Schema for Finance Management System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `budgets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `amount` (numeric)
      - `spent` (numeric)
      - `category` (text)
      - `period` (text, enum: monthly/yearly)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric)
      - `category` (text)
      - `description` (text)
      - `date` (timestamp)
      - `receipt_url` (text, optional)
      - `budget_id` (uuid, references budgets, optional)
      - `created_at` (timestamp)
    
    - `incomes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric)
      - `source` (text)
      - `date` (timestamp)
      - `recurring` (boolean)
      - `budget_id` (uuid, references budgets, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  spent numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  period text NOT NULL CHECK (period IN ('monthly', 'yearly')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  receipt_url text,
  budget_id uuid REFERENCES budgets ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create incomes table
CREATE TABLE IF NOT EXISTS incomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  source text NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  recurring boolean NOT NULL DEFAULT false,
  budget_id uuid REFERENCES budgets ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own budgets"
  ON budgets FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own expenses"
  ON expenses FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own incomes"
  ON incomes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own incomes"
  ON incomes FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();