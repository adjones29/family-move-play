-- Fix 1: Restrict step_entries access to family members only
-- Drop the overly permissive policy that allows anyone to read step data
DROP POLICY IF EXISTS "Allow read access to step entries" ON step_entries;

-- Create family-member-scoped policy for reading step entries
CREATE POLICY "Members can view family step entries" 
ON step_entries FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM family_members fm
    WHERE fm.id = step_entries.member_id 
    AND is_family_member(auth.uid(), fm.family_id)
  )
);

-- Fix 2: Protect family_member_stats view
-- Since family_member_stats is a view (not a table), we need to ensure
-- the underlying tables have proper RLS. The view itself will inherit
-- the security from the underlying tables when queried.
-- However, we should verify RLS is enabled on all underlying tables.

-- Ensure RLS is enabled on family_members (should already be enabled)
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Ensure RLS is enabled on step_entries (should already be enabled)
ALTER TABLE step_entries ENABLE ROW LEVEL SECURITY;

-- Ensure RLS is enabled on points_ledger (should already be enabled)
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;