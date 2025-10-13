-- 1) Ensure profiles table exists (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Enable RLS on profiles if not already enabled
alter table public.profiles enable row level security;

-- 2) Create/refresh trigger to auto-insert a profile whenever a user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer 
set search_path = public
as $$
begin
  insert into public.profiles(id, display_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'name',''), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 3) Backfill any missing profiles for existing users (safe, idempotent)
insert into public.profiles(id, display_name)
select u.id, coalesce(u.raw_user_meta_data->>'name','')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- 4) Confirm/repair FK: families.created_by -> profiles.id
alter table if exists public.families
  drop constraint if exists families_created_by_fkey;
  
alter table public.families
  add constraint families_created_by_fkey
  foreign key (created_by) references public.profiles(id) on delete cascade;