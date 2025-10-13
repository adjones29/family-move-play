-- 1) Ensure signup trigger exists to create profiles row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles(id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2) Families: set created_by automatically to auth.uid() if not provided
CREATE OR REPLACE FUNCTION public.set_families_created_by()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_set_families_created_by ON public.families;
CREATE TRIGGER trg_set_families_created_by
BEFORE INSERT ON public.families
FOR EACH ROW EXECUTE FUNCTION public.set_families_created_by();

-- 3) Tighten/ensure INSERT policy (allow when created_by is current user)
DROP POLICY IF EXISTS families_creator_insert ON public.families;
CREATE POLICY families_creator_insert ON public.families
FOR INSERT
WITH CHECK (created_by = auth.uid());

-- 4) Family members: allow creator to insert their own membership for newly created family
DROP POLICY IF EXISTS fm_parent_insert ON public.family_members;
CREATE POLICY fm_parent_insert ON public.family_members
FOR INSERT
WITH CHECK (
  public.is_family_admin(auth.uid(), family_id)
);

-- Additional policy: allow the family creator to insert their own membership as Parent
DROP POLICY IF EXISTS fm_creator_self_insert ON public.family_members;
CREATE POLICY fm_creator_self_insert ON public.family_members
FOR INSERT
WITH CHECK (
  (user_id = auth.uid()) AND EXISTS (
    SELECT 1 FROM public.families f
    WHERE f.id = family_id AND f.created_by = auth.uid()
  )
);
