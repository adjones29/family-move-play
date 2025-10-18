-- Create a public storage bucket for catalog media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'catalog-media',
  'catalog-media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to read from the bucket
CREATE POLICY "Authenticated users can view catalog media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'catalog-media');

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Authenticated users can upload catalog media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'catalog-media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update catalog media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'catalog-media');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete catalog media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'catalog-media');