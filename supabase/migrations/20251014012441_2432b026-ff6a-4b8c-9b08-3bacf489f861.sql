-- Backfill missing display names so existing 'Unknown' becomes the user's name/email
UPDATE public.family_members fm
SET display_name = COALESCE(p.display_name, u.email, 'Me')
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE fm.user_id = p.id 
  AND (fm.display_name IS NULL OR fm.display_name = '' OR fm.display_name ILIKE '%unknown%');