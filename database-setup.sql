-- MAV Tracker - Database Setup SQL
-- Esegui questo script nel SQL Editor di Supabase

-- ================================
-- TABELLE PRINCIPALI
-- ================================

-- Tabella workouts
CREATE TABLE IF NOT EXISTS workouts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella exercises
CREATE TABLE IF NOT EXISTS exercises (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella workout_exercises (join table)
CREATE TABLE IF NOT EXISTS workout_exercises (
  id BIGSERIAL PRIMARY KEY,
  workout_id BIGINT REFERENCES workouts ON DELETE CASCADE NOT NULL,
  exercise_id BIGINT REFERENCES exercises NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella workout_sets
CREATE TABLE IF NOT EXISTS workout_sets (
  id BIGSERIAL PRIMARY KEY,
  workout_exercise_id BIGINT REFERENCES workout_exercises ON DELETE CASCADE NOT NULL,
  weight NUMERIC NOT NULL,
  reps INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- INDICI PER PERFORMANCE
-- ================================

CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_exercise_id ON workout_sets(workout_exercise_id);

-- ================================
-- ROW LEVEL SECURITY (RLS)
-- ================================

-- Abilita RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- ================================
-- POLICY PER WORKOUTS
-- ================================

DROP POLICY IF EXISTS "Users can view own workouts" ON workouts;
CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own workouts" ON workouts;
CREATE POLICY "Users can insert own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own workouts" ON workouts;
CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own workouts" ON workouts;
CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- ================================
-- POLICY PER WORKOUT_EXERCISES
-- ================================

DROP POLICY IF EXISTS "Users can view own workout_exercises" ON workout_exercises;
CREATE POLICY "Users can view own workout_exercises" ON workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own workout_exercises" ON workout_exercises;
CREATE POLICY "Users can insert own workout_exercises" ON workout_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own workout_exercises" ON workout_exercises;
CREATE POLICY "Users can update own workout_exercises" ON workout_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own workout_exercises" ON workout_exercises;
CREATE POLICY "Users can delete own workout_exercises" ON workout_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- ================================
-- POLICY PER WORKOUT_SETS
-- ================================

DROP POLICY IF EXISTS "Users can view own workout_sets" ON workout_sets;
CREATE POLICY "Users can view own workout_sets" ON workout_sets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own workout_sets" ON workout_sets;
CREATE POLICY "Users can insert own workout_sets" ON workout_sets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own workout_sets" ON workout_sets;
CREATE POLICY "Users can update own workout_sets" ON workout_sets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own workout_sets" ON workout_sets;
CREATE POLICY "Users can delete own workout_sets" ON workout_sets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

-- ================================
-- POLICY PER EXERCISES (Pubblico)
-- ================================

DROP POLICY IF EXISTS "Anyone can view exercises" ON exercises;
CREATE POLICY "Anyone can view exercises" ON exercises
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert exercises" ON exercises;
CREATE POLICY "Authenticated users can insert exercises" ON exercises
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ================================
-- SEED DATA (Opzionale)
-- ================================

-- Inserisci alcuni esercizi comuni
INSERT INTO exercises (name) VALUES
  ('Panca Piana'),
  ('Squat'),
  ('Stacco'),
  ('Military Press'),
  ('Trazioni'),
  ('Dip'),
  ('Rematore'),
  ('Curl Bilanciere'),
  ('French Press')
ON CONFLICT (name) DO NOTHING;
