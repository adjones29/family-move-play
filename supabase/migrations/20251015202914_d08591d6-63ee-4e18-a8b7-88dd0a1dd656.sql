-- Fix step_entries.member_id to use UUID instead of TEXT
-- First, drop the dependent view
DROP VIEW IF EXISTS family_member_stats;

-- Step 1: Add new UUID column
ALTER TABLE step_entries ADD COLUMN member_uuid UUID;

-- Step 2: Try to populate the new column by matching display_name to family_members
UPDATE step_entries se
SET member_uuid = fm.id
FROM family_members fm
WHERE se.member_id = fm.display_name;

-- Step 3: Drop the old text column
ALTER TABLE step_entries DROP COLUMN member_id;

-- Step 4: Rename the new column to member_id
ALTER TABLE step_entries RENAME COLUMN member_uuid TO member_id;

-- Step 5: Make it non-nullable and add foreign key constraint
ALTER TABLE step_entries ALTER COLUMN member_id SET NOT NULL;
ALTER TABLE step_entries ADD CONSTRAINT fk_step_entries_member 
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE;

-- Step 6: Recreate the family_member_stats view with the corrected column type
CREATE OR REPLACE VIEW family_member_stats AS
SELECT 
  fm.id as member_id,
  fm.user_id,
  fm.family_id,
  fm.display_name,
  p.avatar_url,
  fm.role,
  fm.status,
  COALESCE(SUM(CASE WHEN se.date = CURRENT_DATE THEN se.steps ELSE 0 END), 0)::integer as daily_steps,
  COALESCE((
    SELECT SUM(steps) 
    FROM step_entries se2 
    WHERE se2.member_id = fm.id 
      AND se2.date >= (CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)::integer))
      AND se2.date <= CURRENT_DATE
  ), 0)::integer as weekly_steps,
  10000 as daily_goal,
  70000 as weekly_goal,
  COALESCE(SUM(CASE WHEN se.date >= CURRENT_DATE - 6 THEN se.steps ELSE 0 END), 0)::integer as weekly_score,
  COALESCE(pb.points, 0)::integer as points_total
FROM family_members fm
LEFT JOIN profiles p ON p.id = fm.user_id
LEFT JOIN step_entries se ON se.member_id = fm.id
LEFT JOIN v_points_balances pb ON pb.member_id = fm.id
GROUP BY fm.id, fm.user_id, fm.family_id, fm.display_name, p.avatar_url, fm.role, fm.status, pb.points;