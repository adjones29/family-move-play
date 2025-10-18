-- Add media columns to all catalog tables
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS image_bucket text;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS image_folder text;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS image_filename text;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.games ADD COLUMN IF NOT EXISTS image_bucket text;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS image_folder text;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS image_filename text;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS image_bucket text;
ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS image_folder text;
ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS image_filename text;
ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS image_url text;

-- Create views that compute storage_path from bucket/folder/filename
CREATE OR REPLACE VIEW public.v_challenges_media AS
SELECT c.*, 
  CASE WHEN c.image_bucket IS NOT NULL AND c.image_folder IS NOT NULL AND c.image_filename IS NOT NULL
       THEN c.image_bucket || '/' || c.image_folder || '/' || c.image_filename
       ELSE NULL END AS storage_path
FROM public.challenges c;

CREATE OR REPLACE VIEW public.v_games_media AS
SELECT g.*, 
  CASE WHEN g.image_bucket IS NOT NULL AND g.image_folder IS NOT NULL AND g.image_filename IS NOT NULL
       THEN g.image_bucket || '/' || g.image_folder || '/' || g.image_filename
       ELSE NULL END AS storage_path
FROM public.games g;

CREATE OR REPLACE VIEW public.v_rewards_media AS
SELECT r.*, 
  CASE WHEN r.image_bucket IS NOT NULL AND r.image_folder IS NOT NULL AND r.image_filename IS NOT NULL
       THEN r.image_bucket || '/' || r.image_folder || '/' || r.image_filename
       ELSE NULL END AS storage_path
FROM public.rewards r;