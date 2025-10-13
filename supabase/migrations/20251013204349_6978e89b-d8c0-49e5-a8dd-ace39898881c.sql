-- Update the INSERT RLS policy to be more permissive
DROP POLICY IF EXISTS families_creator_insert ON public.families;
CREATE POLICY families_creator_insert ON public.families
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (created_by = auth.uid() OR created_by IS NULL)
);

-- Ensure the trigger function exists with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.set_families_created_by()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Always set created_by to the current authenticated user
  NEW.created_by := auth.uid();
  RETURN NEW;
END;
$$;

-- Ensure the trigger is attached
DROP TRIGGER IF EXISTS trg_set_families_created_by ON public.families;
CREATE TRIGGER trg_set_families_created_by
BEFORE INSERT ON public.families
FOR EACH ROW
EXECUTE FUNCTION public.set_families_created_by();