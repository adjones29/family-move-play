-- Add INSERT policy for profiles (in case the trigger hasn't created the profile yet)
DROP POLICY IF EXISTS profiles_self_insert ON public.profiles;
CREATE POLICY profiles_self_insert ON public.profiles
FOR INSERT 
WITH CHECK (id = auth.uid());

-- Ensure the families INSERT policy is correct
DROP POLICY IF EXISTS families_creator_insert ON public.families;
CREATE POLICY families_creator_insert ON public.families
FOR INSERT 
WITH CHECK (created_by = auth.uid());