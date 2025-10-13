-- Allow creators to read their own families so INSERT ... RETURNING works
DROP POLICY IF EXISTS families_creator_select ON public.families;
CREATE POLICY families_creator_select
ON public.families
FOR SELECT
TO authenticated
USING (created_by = auth.uid());