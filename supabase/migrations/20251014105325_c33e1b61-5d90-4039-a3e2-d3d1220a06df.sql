-- Helper: week bounds for a Sunday-start week (Sunday=0 ... Saturday=6)
create or replace function public.current_week_bounds_sun_sat(tz text default 'UTC')
returns table (week_start date, week_end date)
language sql stable as $$
  with now_tz as (
    select (now() at time zone tz)::date as today
  ),
  sunday_calc as (
    select today - (extract(dow from today)::int) as sunday_start
    from now_tz
  )
  select 
    sunday_start as week_start,
    sunday_start + 6 as week_end
  from sunday_calc;
$$;

-- Recreate family_member_stats view with Sunday-Saturday weekly logic
drop view if exists public.family_member_stats;

create or replace view public.family_member_stats as
select 
  fm.id as member_id,
  fm.user_id,
  fm.family_id,
  fm.display_name,
  p.avatar_url,
  fm.role,
  fm.status,
  coalesce(sum(case when se.date = current_date then se.steps else 0 end), 0)::int as daily_steps,
  10000 as daily_goal,
  coalesce(sum(case 
    when se.date >= (select week_start from current_week_bounds_sun_sat())
     and se.date <= (select week_end from current_week_bounds_sun_sat())
    then se.steps else 0 end), 0)::int as weekly_steps,
  50000 as weekly_goal,
  coalesce(sum(se.steps), 0)::int as points_total,
  least(100, (coalesce(sum(case 
    when se.date >= (select week_start from current_week_bounds_sun_sat())
     and se.date <= (select week_end from current_week_bounds_sun_sat())
    then se.steps else 0 end), 0) * 100 / 50000))::int as weekly_score
from public.family_members fm
left join public.profiles p on fm.user_id = p.id
left join public.step_entries se on se.member_id = fm.id::text
group by fm.id, fm.user_id, fm.family_id, fm.display_name, p.avatar_url, fm.role, fm.status;