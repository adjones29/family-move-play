/*
  # FitFam Database Schema

  1. New Tables
    - `challenges`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text) - daily, weekly, special
      - `participants` (integer)
      - `progress` (integer, default 0)
      - `total_goal` (integer)
      - `days_left` (integer)
      - `reward` (text)
      - `difficulty` (text) - easy, medium, hard
      - `category` (text)
      - `status` (text, default 'active')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `mini_games`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `duration` (text)
      - `participants` (text)
      - `difficulty` (text) - easy, medium, hard
      - `points` (integer)
      - `category` (text)
      - `icon_name` (text)
      - `status` (text, default 'active')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `rewards`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `cost` (integer)
      - `category` (text) - family, individual, special
      - `rarity` (text) - common, rare, epic, legendary
      - `time_limit` (text, nullable)
      - `participants_required` (integer, nullable)
      - `icon_name` (text, nullable)
      - `available` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Add policies for authenticated users to update challenge progress
*/

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'weekly', 'special')),
  participants integer NOT NULL DEFAULT 1,
  progress integer NOT NULL DEFAULT 0,
  total_goal integer NOT NULL,
  days_left integer NOT NULL,
  reward text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mini_games table
CREATE TABLE IF NOT EXISTS mini_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  participants text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points integer NOT NULL DEFAULT 0,
  category text,
  icon_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  cost integer NOT NULL,
  category text NOT NULL CHECK (category IN ('family', 'individual', 'special')),
  rarity text NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  time_limit text,
  participants_required integer,
  icon_name text,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mini_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for challenges
CREATE POLICY "Anyone can read challenges"
  ON challenges
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can update challenge progress"
  ON challenges
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for mini_games
CREATE POLICY "Anyone can read mini games"
  ON mini_games
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create policies for rewards
CREATE POLICY "Anyone can read rewards"
  ON rewards
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Insert sample challenges
INSERT INTO challenges (title, description, type, participants, progress, total_goal, days_left, reward, difficulty, category) VALUES
('Family Walk Week', 'Take 50,000 steps together as a family this week!', 'weekly', 4, 32150, 50000, 3, 'Movie Night', 'medium', 'steps'),
('Dance Party Daily', 'Dance for 15 minutes every day this week', 'daily', 4, 4, 7, 3, 'Ice Cream Trip', 'easy', 'activity'),
('Fitness Champions', 'Complete 5 different mini-games this month', 'special', 4, 3, 5, 12, 'Theme Park Visit', 'hard', 'games');

-- Insert sample mini games
INSERT INTO mini_games (title, description, duration, participants, difficulty, points, category, icon_name) VALUES
('Push-up Challenge', 'See who can do the most push-ups in 60 seconds!', '1-2 min', '2-4 players', 'medium', 50, 'strength', 'dumbbell'),
('Animal Yoga', 'Copy fun animal poses and movements together', '5-10 min', '1-4 players', 'easy', 30, 'flexibility', 'target'),
('Obstacle Course', 'Navigate through a living room obstacle course', '3-5 min', '1-4 players', 'hard', 75, 'agility', 'zap'),
('Dance Battle', 'Follow the rhythm and dance moves for 3 minutes', '3-5 min', '1-4 players', 'medium', 60, 'cardio', 'heart'),
('Jumping Jacks Race', 'Who can do 100 jumping jacks the fastest?', '2-3 min', '2-4 players', 'easy', 40, 'cardio', 'zap'),
('Family Fitness Relay', 'Complete stations together as a team', '10-15 min', '3-4 players', 'hard', 100, 'team', 'users'),
('Mirror Exercise', 'Copy each other''s movements in sync', '5-7 min', '2-4 players', 'easy', 35, 'team', 'target');

-- Insert sample rewards
INSERT INTO rewards (title, description, cost, category, rarity, time_limit, participants_required, icon_name) VALUES
('Family Movie Night', 'Choose any movie for tonight''s family viewing with snacks included!', 50, 'family', 'common', NULL, 2, 'popcorn'),
('Ice Cream Shop Visit', 'Family trip to your favorite ice cream parlor - everyone gets two scoops!', 75, 'family', 'rare', 'Valid for 7 days', 3, 'gift'),
('Theme Park Adventure', 'Full day at the local theme park with fast passes included!', 200, 'family', 'legendary', 'Valid for 30 days', 4, 'car'),
('Extra Screen Time', 'Earn 30 minutes of bonus screen time for games or videos', 25, 'individual', 'common', 'Use within 3 days', NULL, 'gamepad2'),
('Pick Tonight''s Dinner', 'Choose what the whole family has for dinner (within reason!)', 40, 'individual', 'rare', 'Valid today only', NULL, 'pizza'),
('Special Purchase', 'Pick one small item during our next shopping trip', 60, 'individual', 'epic', 'Valid for 14 days', NULL, 'shopping-bag'),
('Skip One Chore', 'Get out of doing one assigned household chore this week', 30, 'special', 'common', 'Use this week', NULL, 'home'),
('Plan Family Outing', 'You get to plan and choose our next family adventure!', 100, 'special', 'epic', 'Valid for 21 days', 4, 'map-pin'),
('Birthday Week Special', 'Extra special privileges during your birthday week!', 150, 'special', 'legendary', 'Save for birthday', NULL, 'cake');