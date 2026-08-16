-- =============================================================================
-- Staff accounts, roles and approval.
--
-- Run this once in the Supabase SQL editor (Database → SQL Editor → New query),
-- then run the bootstrap statement at the bottom to make yourself super admin.
--
-- The design in one line: anyone may sign up, nobody gets in until a super
-- admin approves them. That is what makes open sign-ups safe — a new account
-- is inert, not trusted.
-- =============================================================================


-- ------------------------------------------------------------------ the table
create table if not exists public.staff (
  -- Same id as the auth user; deleting the auth user removes this row with it.
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,

  -- 'staff'       — read and triage applications, write the journal.
  -- 'super_admin' — all of that, plus approving and managing other accounts.
  role text not null default 'staff' check (role in ('super_admin', 'staff')),

  -- 'pending'   — signed up, waiting for a super admin. No access at all.
  -- 'approved'  — normal working account.
  -- 'suspended' — off-boarded. Kept rather than deleted so their history and
  --               the audit trail survive; access stops on the next request.
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'suspended')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.staff enable row level security;

grant select, update on public.staff to authenticated;


-- --------------------------------------------------------- role check helper
-- A policy on `staff` that queries `staff` recurses forever. A security-definer
-- function runs as its creator and bypasses RLS, which breaks the loop.
create schema if not exists private;

create or replace function private.is_super_admin()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff
    where id = (select auth.uid())
      and role = 'super_admin'
      and status = 'approved'
  );
$$;


-- ---------------------------------------------------------------- policies
-- Everyone may read their own row — that is how the dashboard knows whether
-- the person is approved, and what to show them.
drop policy if exists "staff read own row" on public.staff;
create policy "staff read own row"
  on public.staff for select to authenticated
  using ( (select auth.uid()) = id );

-- Super admins may read every row: that is the user-management screen.
drop policy if exists "super admin reads all" on public.staff;
create policy "super admin reads all"
  on public.staff for select to authenticated
  using ( (select private.is_super_admin()) );

-- Only super admins may change rows. Note there is deliberately NO policy
-- letting people update their own row: without this, a pending account could
-- simply approve itself, and every account could promote itself to super
-- admin. Approval has to come from someone else to mean anything.
drop policy if exists "super admin updates all" on public.staff;
create policy "super admin updates all"
  on public.staff for update to authenticated
  using ( (select private.is_super_admin()) )
  with check ( (select private.is_super_admin()) );

-- No insert policy: rows appear only via the sign-up trigger below.
-- No delete policy: suspend instead, so history is never orphaned.


-- ----------------------------------------------------------------- trigger
-- Creates the staff row when someone signs up. Runs as definer because the
-- signing-up user has no rights on this table yet.
create or replace function public.handle_new_staff()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.staff (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  -- Never block a sign-up because the profile row already exists.
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_staff();


-- --------------------------------------------------------------- timestamps
create or replace function public.touch_staff_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists staff_updated_at on public.staff;
create trigger staff_updated_at
  before update on public.staff
  for each row execute procedure public.touch_staff_updated_at();


-- =============================================================================
-- BOOTSTRAP — run AFTER signing up at /admin/signup with this address.
--
-- There is a chicken and egg here: only a super admin can approve accounts,
-- and at the start there is no super admin. This statement creates the first
-- one. Everyone after this is approved through the dashboard.
--
--   update public.staff
--      set role = 'super_admin', status = 'approved'
--    where email = 'dylanbless38@gmail.com';
--
-- Check it worked:
--   select email, role, status from public.staff;
-- =============================================================================
