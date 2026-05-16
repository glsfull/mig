/*
  # Create analyses and medications tables

  1. New Tables
    - `analyses` — stores uploaded lab reports per user
      - id, user_id, type (blood/urine/etc), file_name, raw_text, ai_results (jsonb), created_at
    - `symptoms_sessions` — stores symptom descriptions and AI diagnosis
      - id, user_id, analysis_id, symptoms_text, ai_response (jsonb), created_at
    - `medications` — user's medication schedule
      - id, user_id, name, dosage, unit, times (text[]), start_date, end_date, notes, active

  2. Security
    - RLS enabled on all tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'blood',
  file_name text NOT NULL DEFAULT '',
  raw_text text DEFAULT '',
  ai_results jsonb DEFAULT '[]'::jsonb,
  ai_summary text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own analyses"
  ON analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Symptoms sessions
CREATE TABLE IF NOT EXISTS symptoms_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id uuid REFERENCES analyses(id) ON DELETE SET NULL,
  symptoms_text text NOT NULL DEFAULT '',
  ai_response jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE symptoms_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own symptom sessions"
  ON symptoms_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom sessions"
  ON symptoms_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptom sessions"
  ON symptoms_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Medications
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  dosage text NOT NULL DEFAULT '',
  unit text NOT NULL DEFAULT 'таб.',
  times text[] NOT NULL DEFAULT ARRAY['09:00'],
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  notes text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications"
  ON medications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
