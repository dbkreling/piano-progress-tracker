-- Piano Progress Tracker - Initial Database Schema
-- This migration creates all necessary tables, indexes, and Row-Level Security policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice sessions
CREATE TABLE public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  is_for_next_lesson BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice items (what was practiced in each session)
CREATE TABLE public.practice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_session_id UUID NOT NULL REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'scale', 'repertoire', 'technical', 'sight-reading', 'theory', 'ear-training'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Syllabus items (pieces, scales, exercises to track)
CREATE TABLE public.syllabus_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL, -- 'RCM Prep A', 'RCM Prep B', 'RCM 1', 'RCM 2', etc.
  status TEXT NOT NULL DEFAULT 'planned', -- 'planned', 'in-progress', 'ready-for-exam', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theory levels (RCM syllabus data - pre-populated reference data)
CREATE TABLE public.theory_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_name TEXT NOT NULL UNIQUE, -- 'Prep A', 'Prep B', 'Level 1', 'Level 2', etc.
  scales_list JSONB, -- Array of scale definitions
  repertoire JSONB, -- Repertoire lists by category (A/B/C/D)
  technical_requirements JSONB, -- Technical requirements (arpeggios, chords, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User theory progress (tracks user's progress through theory topics)
CREATE TABLE public.user_theory_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  topic TEXT NOT NULL, -- 'intervals', 'scales', 'chords', 'rhythm', etc.
  score INTEGER CHECK (score >= 0 AND score <= 100),
  last_review TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, level, topic)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_practice_sessions_user_date
  ON public.practice_sessions(user_id, date DESC);

CREATE INDEX idx_practice_items_session
  ON public.practice_items(practice_session_id);

CREATE INDEX idx_syllabus_items_user
  ON public.syllabus_items(user_id, level, status);

CREATE INDEX idx_user_theory_progress_user
  ON public.user_theory_progress(user_id, level);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_theory_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theory_levels ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Practice sessions policies
CREATE POLICY "Users can view own practice sessions"
  ON public.practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own practice sessions"
  ON public.practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice sessions"
  ON public.practice_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice sessions"
  ON public.practice_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Practice items policies
CREATE POLICY "Users can view own practice items"
  ON public.practice_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.practice_sessions
      WHERE practice_sessions.id = practice_items.practice_session_id
      AND practice_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create practice items"
  ON public.practice_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.practice_sessions
      WHERE practice_sessions.id = practice_items.practice_session_id
      AND practice_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own practice items"
  ON public.practice_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.practice_sessions
      WHERE practice_sessions.id = practice_items.practice_session_id
      AND practice_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own practice items"
  ON public.practice_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.practice_sessions
      WHERE practice_sessions.id = practice_items.practice_session_id
      AND practice_sessions.user_id = auth.uid()
    )
  );

-- Syllabus items policies
CREATE POLICY "Users can view own syllabus items"
  ON public.syllabus_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own syllabus items"
  ON public.syllabus_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own syllabus items"
  ON public.syllabus_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own syllabus items"
  ON public.syllabus_items FOR DELETE
  USING (auth.uid() = user_id);

-- User theory progress policies
CREATE POLICY "Users can view own theory progress"
  ON public.user_theory_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own theory progress"
  ON public.user_theory_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own theory progress"
  ON public.user_theory_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own theory progress"
  ON public.user_theory_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Theory levels is public read (reference data, no user_id)
CREATE POLICY "Authenticated users can view theory levels"
  ON public.theory_levels FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_sessions_updated_at
  BEFORE UPDATE ON public.practice_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_syllabus_items_updated_at
  BEFORE UPDATE ON public.syllabus_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.practice_sessions IS 'Individual practice sessions with duration, rating, and notes';
COMMENT ON TABLE public.practice_items IS 'Items practiced in each session (scales, pieces, exercises)';
COMMENT ON TABLE public.syllabus_items IS 'Syllabus items (pieces, scales) tracked by user with status';
COMMENT ON TABLE public.theory_levels IS 'RCM syllabus reference data (scales, repertoire, technical requirements)';
COMMENT ON TABLE public.user_theory_progress IS 'User progress through theory topics and exercises';

COMMENT ON COLUMN public.practice_sessions.rating IS 'Self-rating 1-5 for practice quality';
COMMENT ON COLUMN public.practice_sessions.is_for_next_lesson IS 'Flag to mark sessions for lesson prep export';
COMMENT ON COLUMN public.syllabus_items.status IS 'planned, in-progress, ready-for-exam, or completed';
