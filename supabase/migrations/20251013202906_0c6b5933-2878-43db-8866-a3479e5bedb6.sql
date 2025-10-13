-- Fix function search path issue
CREATE OR REPLACE FUNCTION public.set_families_created_by()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END; $$;