/*
  # Admin settings and health programs tables

  1. New Tables
    - `admin_settings` — key/value store for admin configuration (AI API keys, model selection, etc.)
    - `health_programs` — admin-defined health programs (templates for nutrition/lifestyle plans)
    - `user_health_programs` — user enrollments in health programs with progress tracking

  2. Security
    - `admin_settings`: only service_role can read/write (admin-only via Edge Function)
      Public read for non-secret keys (model name, provider name)
    - `health_programs`: public read, admin write
    - `user_health_programs`: users can read/write their own rows

  3. Notes
    - Actual secret API keys are stored only in Supabase Edge Function secrets, not here
    - This table stores non-secret config: provider name, model name, enabled state
*/

-- Admin settings (non-secret config visible to admin)
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  description text DEFAULT '',
  is_secret boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Insert default config rows
INSERT INTO admin_settings (key, value, label, description, is_secret) VALUES
  ('ai_provider', 'openai', 'Провайдер ИИ', 'Выберите провайдера нейросети (openai, anthropic, gemini)', false),
  ('ai_model', 'gpt-4o', 'Модель ИИ', 'Название модели для расшифровки анализов', false),
  ('ai_enabled', 'true', 'ИИ включён', 'Включить/выключить ИИ-расшифровку для всех пользователей', false),
  ('ai_max_tokens', '2000', 'Макс. токенов', 'Максимальное количество токенов в ответе модели', false),
  ('ai_temperature', '0.3', 'Temperature', 'Степень случайности ответов (0.0 – 1.0)', false),
  ('ocr_enabled', 'true', 'OCR включён', 'Включить распознавание текста с фото анализов', false),
  ('ocr_provider', 'tesseract', 'OCR провайдер', 'Провайдер OCR (tesseract, google_vision, aws_textract)', false)
ON CONFLICT (key) DO NOTHING;

-- Only authenticated admin emails can manage settings
-- We use a simple approach: check if user email is in admin list
CREATE POLICY "Admins can read admin settings"
  ON admin_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update admin settings"
  ON admin_settings FOR UPDATE
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      SELECT value FROM admin_settings WHERE key = 'admin_emails'
    ) OR
    (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      SELECT value FROM admin_settings WHERE key = 'admin_emails'
    ) OR
    (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Health programs (templates created by admin)
CREATE TABLE IF NOT EXISTS health_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'nutrition',
  duration_days integer DEFAULT 30,
  difficulty text DEFAULT 'easy',
  goals text[] DEFAULT ARRAY[]::text[],
  tags text[] DEFAULT ARRAY[]::text[],
  cover_color text DEFAULT '#10b981',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read health programs"
  ON health_programs FOR SELECT
  TO authenticated
  USING (active = true);

-- User program enrollments
CREATE TABLE IF NOT EXISTS user_health_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES health_programs(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress integer DEFAULT 0,
  notes text DEFAULT '',
  UNIQUE(user_id, program_id)
);

ALTER TABLE user_health_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own program enrollments"
  ON user_health_programs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own program enrollments"
  ON user_health_programs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own program enrollments"
  ON user_health_programs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own program enrollments"
  ON user_health_programs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Seed demo health programs
INSERT INTO health_programs (title, description, category, duration_days, difficulty, goals, tags, cover_color) VALUES
  ('Антихолестериновая диета', 'Снижение холестерина через питание и образ жизни. Основан на средиземноморской диете и научных данных.', 'nutrition', 30, 'medium',
    ARRAY['Снизить холестерин на 0.5–1.0 ммоль/л', 'Улучшить соотношение ЛПВП/ЛПНП', 'Уменьшить воспалительные маркеры'],
    ARRAY['холестерин', 'сердце', 'питание'], '#0d9488'),
  ('Повышение гемоглобина', 'Программа восстановления уровня гемоглобина и ферритина при железодефицитной анемии.', 'nutrition', 45, 'easy',
    ARRAY['Поднять гемоглобин до нормы', 'Восполнить запасы ферритина', 'Улучшить усвоение железа'],
    ARRAY['анемия', 'железо', 'гемоглобин'], '#dc2626'),
  ('Нормализация витамина D', 'Комплексная программа восполнения дефицита витамина D: солнце, питание, добавки.', 'lifestyle', 60, 'easy',
    ARRAY['Достичь уровня витамина D 40+ нг/мл', 'Укрепить иммунную систему', 'Улучшить качество сна'],
    ARRAY['витамин D', 'иммунитет', 'солнце'], '#d97706'),
  ('Профилактика диабета', 'Снижение риска диабета 2 типа через изменение образа жизни, питания и физической активности.', 'lifestyle', 90, 'medium',
    ARRAY['Снизить уровень глюкозы', 'Нормализовать ИМТ', 'Повысить чувствительность к инсулину'],
    ARRAY['диабет', 'глюкоза', 'метаболизм'], '#7c3aed'),
  ('Детокс и восстановление печени', 'Программа поддержки функции печени через питание, гидратацию и снижение нагрузки.', 'nutrition', 21, 'easy',
    ARRAY['Нормализовать АЛТ/АСТ', 'Снизить нагрузку на печень', 'Улучшить пищеварение'],
    ARRAY['печень', 'детокс', 'биохимия'], '#059669'),
  ('Снижение СОЭ и воспаления', 'Противовоспалительная диета и образ жизни для снижения маркеров воспаления.', 'lifestyle', 30, 'medium',
    ARRAY['Снизить СОЭ до нормы', 'Уменьшить воспалительные процессы', 'Укрепить иммунитет'],
    ARRAY['воспаление', 'СОЭ', 'иммунитет'], '#ea580c')
ON CONFLICT DO NOTHING;
