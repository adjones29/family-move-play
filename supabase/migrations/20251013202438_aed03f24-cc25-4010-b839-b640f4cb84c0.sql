-- Create security definer function to check family membership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_family_member(p_user uuid, p_family uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members
    WHERE user_id = p_user AND family_id = p_family
  );
$$;

-- Update families select policy to use the security definer function
DROP POLICY IF EXISTS families_member_select ON public.families;
CREATE POLICY families_member_select ON public.families
FOR SELECT 
USING (public.is_family_member(auth.uid(), id));

-- Update family_members select policy to use the security definer function
DROP POLICY IF EXISTS fm_member_select ON public.family_members;
CREATE POLICY fm_member_select ON public.family_members
FOR SELECT 
USING (public.is_family_member(auth.uid(), family_id));