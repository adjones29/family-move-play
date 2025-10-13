-- Create the missing trigger on the families table
DROP TRIGGER IF EXISTS trg_set_families_created_by ON public.families;
CREATE TRIGGER trg_set_families_created_by
BEFORE INSERT ON public.families
FOR EACH ROW EXECUTE FUNCTION public.set_families_created_by();