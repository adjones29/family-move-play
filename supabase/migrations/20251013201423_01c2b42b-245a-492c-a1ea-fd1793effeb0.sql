-- Make user_id nullable and add display_name to family_members
ALTER TABLE public.family_members
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS display_name text;

-- Update my_family_members view to use display_name from family_members when available
CREATE OR REPLACE VIEW public.my_family_members AS
SELECT 
  fm.id, 
  fm.family_id, 
  fm.user_id, 
  COALESCE(fm.display_name, p.display_name) as display_name,
  p.avatar_url, 
  fm.role, 
  fm.status, 
  fm.joined_at
FROM public.family_members fm
LEFT JOIN public.profiles p ON p.id = fm.user_id
WHERE EXISTS (
  SELECT 1 FROM public.family_members me
  WHERE me.user_id = auth.uid() AND me.family_id = fm.family_id
);

-- Update insert policy to allow creating members without user_id
DROP POLICY IF EXISTS fm_parent_insert ON public.family_members;
CREATE POLICY fm_parent_insert ON public.family_members
FOR INSERT 
WITH CHECK (
  is_family_admin(auth.uid(), family_id)
);