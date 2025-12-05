-- Create v_games_media view (matching pattern of v_challenges_media and v_rewards_media)
CREATE OR REPLACE VIEW public.v_games_media AS
SELECT
  g.id,
  g.title,
  g.description,
  g.category,
  g.points,
  NULL::text AS image_url,
  NULL::text AS image_bucket,
  NULL::text AS image_folder,
  NULL::text AS image_filename,
  NULL::text AS storage_path
FROM public.games g;

-- Add SELECT policy for games table so users can read games
CREATE POLICY "Users can read games"
ON public.games
FOR SELECT
USING (true);