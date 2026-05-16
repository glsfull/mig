/*
  # Extended health platform tables

  1. New Tables
    - `health_profiles` — user's personal health data (age, sex, weight, height, chronic conditions)
    - `risk_assessments` — stored risk calculation results per user
    - `health_articles_views` — tracks which encyclopedia articles user viewed

  2. Security
    - RLS enabled on all tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS health_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  age integer DEFAULT 0,
  sex text DEFAULT 'male',
  weight_kg numeric(5,1) DEFAULT 0,
  height_cm integer DEFAULT 0,
  blood_type text DEFAULT '',
  chronic_conditions text[] DEFAULT ARRAY[]::text[],
  allergies text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own health profile"
  ON health_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health profile"
  ON health_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health profile"
  ON health_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Risk assessments
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type text NOT NULL DEFAULT 'general',
  score integer NOT NULL DEFAULT 0,
  factors jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own risk assessments"
  ON risk_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk assessments"
  ON risk_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own risk assessments"
  ON risk_assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
