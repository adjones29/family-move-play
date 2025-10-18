-- Create enums for catalog types
CREATE TYPE public.challenge_difficulty AS ENUM ('easy','medium','hard');
CREATE TYPE public.game_category AS ENUM ('exercise','fun','adventure');
CREATE TYPE public.reward_type AS ENUM ('family','individual','special');

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  difficulty challenge_difficulty NOT NULL,
  points integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS challenges_difficulty_idx ON public.challenges(difficulty) WHERE is_active;

-- Create games table
CREATE TABLE IF NOT EXISTS public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  category game_category NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS games_category_idx ON public.games(category) WHERE is_active;

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  type reward_type NOT NULL,
  cost integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rewards_type_idx ON public.rewards(type) WHERE is_active;

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies: authenticated users can read active items
CREATE POLICY "Users can read active challenges" ON public.challenges 
  FOR SELECT TO authenticated USING (is_active);

CREATE POLICY "Users can read active games" ON public.games 
  FOR SELECT TO authenticated USING (is_active);

CREATE POLICY "Users can read active rewards" ON public.rewards 
  FOR SELECT TO authenticated USING (is_active);

-- Admin policies: authenticated users can insert/update (adjust if you want stricter role-based access)
CREATE POLICY "Authenticated users can insert challenges" ON public.challenges 
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update challenges" ON public.challenges 
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert games" ON public.games 
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update games" ON public.games 
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert rewards" ON public.rewards 
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update rewards" ON public.rewards 
  FOR UPDATE TO authenticated USING (true);