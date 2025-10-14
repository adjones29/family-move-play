-- Create family_member_stats view to aggregate member statistics
CREATE OR REPLACE VIEW public.family_member_stats AS
SELECT 
  fm.id as member_id,
  fm.user_id,
  fm.family_id,
  fm.display_name,
  p.avatar_url,
  fm.role,
  fm.status,
  -- Calculate total points (placeholder - can be updated based on actual points logic)
  COALESCE(SUM(se.steps) / 100, 0)::integer as points_total,
  -- Daily steps (today)
  COALESCE(SUM(CASE WHEN se.date = CURRENT_DATE THEN se.steps ELSE 0 END), 0)::integer as daily_steps,
  10000 as daily_goal,
  -- Weekly steps (last 7 days)
  COALESCE(SUM(CASE WHEN se.date >= CURRENT_DATE - INTERVAL '7 days' THEN se.steps ELSE 0 END), 0)::integer as weekly_steps,
  70000 as weekly_goal,
  -- Weekly score (based on days goals met in last 7 days)
  COUNT(DISTINCT CASE WHEN se.date >= CURRENT_DATE - INTERVAL '7 days' AND se.steps >= 10000 THEN se.date ELSE NULL END)::integer as weekly_score
FROM public.family_members fm
LEFT JOIN public.profiles p ON p.id = fm.user_id
LEFT JOIN public.step_entries se ON se.member_id = fm.id::text
GROUP BY fm.id, fm.user_id, fm.family_id, fm.display_name, p.avatar_url, fm.role, fm.status;

-- Enable RLS on the view (inherits from underlying tables)
ALTER VIEW public.family_member_stats SET (security_invoker = true);