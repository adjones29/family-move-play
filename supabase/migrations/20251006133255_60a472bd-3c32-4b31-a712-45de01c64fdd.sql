-- 1) Profiles table (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2) Families
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  invite_code text unique,
  created_at timestamptz default now()
);
create index if not exists idx_families_created_by on public.families(created_by);

-- 3) Family members (membership link between profiles and families)
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('Parent','Child')),
  status text not null default 'Active',
  joined_at timestamptz default now(),
  unique (family_id, user_id)
);
create index if not exists idx_family_members_family on public.family_members(family_id);
create index if not exists idx_family_members_user on public.family_members(user_id);

-- 4) Helper function: is user an admin of a family?
create or replace function public.is_family_admin(p_user uuid, p_family uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.family_members
    where user_id = p_user and family_id = p_family and role = 'Parent'
  );
$$;

-- 5) Enable RLS
alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;

-- 6) RLS policies
-- profiles: user can read/update own row
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
for select using (id = auth.uid());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update using (id = auth.uid());

drop policy if exists profiles_self_insert on public.profiles;
create policy profiles_self_insert on public.profiles
for insert with check (id = auth.uid());

-- families: members can select their family; creator can insert; parents can update
drop policy if exists families_member_select on public.families;
create policy families_member_select on public.families
for select using (exists (
  select 1 from public.family_members fm
  where fm.family_id = families.id and fm.user_id = auth.uid()
));

drop policy if exists families_creator_insert on public.families;
create policy families_creator_insert on public.families
for insert with check (created_by = auth.uid());

drop policy if exists families_parent_update on public.families;
create policy families_parent_update on public.families
for update using (public.is_family_admin(auth.uid(), id));

-- family_members: users can see members of their families; only parents can insert/remove members into their family
drop policy if exists fm_member_select on public.family_members;
create policy fm_member_select on public.family_members
for select using (exists (
  select 1 from public.family_members me
  where me.user_id = auth.uid() and me.family_id = family_members.family_id
));

drop policy if exists fm_parent_insert on public.family_members;
create policy fm_parent_insert on public.family_members
for insert with check (public.is_family_admin(auth.uid(), family_id));

drop policy if exists fm_parent_update on public.family_members;
create policy fm_parent_update on public.family_members
for update using (public.is_family_admin(auth.uid(), family_id));

drop policy if exists fm_parent_delete on public.family_members;
create policy fm_parent_delete on public.family_members
for delete using (public.is_family_admin(auth.uid(), family_id));

-- 7) Convenience view: my_family_members (scoped to current user via RLS)
create or replace view public.my_family_members as
select fm.id, fm.family_id, fm.user_id, p.display_name, p.avatar_url, fm.role, fm.status, fm.joined_at
from public.family_members fm
join public.profiles p on p.id = fm.user_id
where exists (
  select 1 from public.family_members me
  where me.user_id = auth.uid() and me.family_id = fm.family_id
);

-- 8) Seed: ensure a profile row is created on signup via trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();