-- Add missing columns to games table to match challenges/rewards pattern
ALTER TABLE public.games 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_bucket TEXT,
ADD COLUMN IF NOT EXISTS image_folder TEXT,
ADD COLUMN IF NOT EXISTS image_filename TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Recreate v_games_media view with storage_path
DROP VIEW IF EXISTS public.v_games_media;
CREATE VIEW public.v_games_media AS
SELECT 
  g.id,
  g.title,
  g.description,
  g.category,
  g.points,
  g.image_url,
  g.image_bucket,
  g.image_folder,
  g.image_filename,
  CASE 
    WHEN g.image_bucket IS NOT NULL AND g.image_folder IS NOT NULL AND g.image_filename IS NOT NULL 
    THEN g.image_bucket || '/' || g.image_folder || '/' || g.image_filename
    ELSE NULL
  END AS storage_path
FROM public.games g
WHERE g.is_active = true;

-- Create catalog-images storage bucket for AI-generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-images', 'catalog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for catalog-images bucket
CREATE POLICY "Public read access for catalog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'catalog-images');

CREATE POLICY "Authenticated users can upload catalog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'catalog-images' AND auth.uid() IS NOT NULL);