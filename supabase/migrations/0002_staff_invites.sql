-- =============================================================================
-- Invites: a super admin creating an account for someone else.
--
-- Run this in the Supabase SQL editor AFTER 0001_staff_accounts.sql.
--
-- Why an invite rather than creating the auth user outright: creating a user
-- directly needs the Admin API, which needs a secret key held by the web app —
-- a key that bypasses row-level security on every table. Trading that blast
-- radius for one convenience is a bad deal. An invite gets the same result:
-- the super admin decides who joins and with what role, and the person sets
-- their own password, which nobody else ever knows.
-- =============================================================================


create table if not exists public.staff_invites (
  -- Lowercased on the way in so a capitalised sign-up still matches.
  email text primary key,
  role text not null default 'staff' check (role in ('super_admin', 'staff')),
  invited_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  -- Set when the person signs up. Kept rather than deleted so there is a
  -- record of who let whom in.
  accepted_at timestamptz
);

alter table public.staff_invites enable row level security;

grant select, insert, delete on public.staff_invites to authenticated;


-- ---------------------------------------------------------------- policies
-- Super admins only, for every operation. An invite is a grant of access, so
-- being able to read the list is itself privileged information.
drop policy if exists "super admin reads invites" on public.staff_invites;
create policy "super admin reads invites"
  on public.staff_invites for select to authenticated
  using ( (select private.is_super_admin()) );

drop policy if exists "super admin creates invites" on public.staff_invites;
create policy "super admin creates invites"
  on public.staff_invites for insert to authenticated
  with check ( (select private.is_super_admin()) );

drop policy if exists "super admin deletes invites" on public.staff_invites;
create policy "super admin deletes invites"
  on public.staff_invites for delete to authenticated
  using ( (select private.is_super_admin()) );


-- ----------------------------------------------------------------- trigger
-- Replaces the version from 0001. An invited address is approved immediately
-- with the role it was invited as; anyone else still lands as 'pending'.
create or replace function public.handle_new_staff()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  invite public.staff_invites%rowtype;
begin
  select *
    into invite
    from public.staff_invites
   where email = lower(new.email)
     and accepted_at is null;

  insert into public.staff (id, email, full_name, role, status)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(invite.role, 'staff'),
    case when invite.email is not null then 'approved' else 'pending' end
  )
  on conflict (id) do nothing;

  if invite.email is not null then
    update public.staff_invites
       set accepted_at = now()
     where email = invite.email;
  end if;

  return new;
end;
$$;

-- The trigger itself is unchanged from 0001 and still points at this function,
-- but recreate it so this file can be run on its own.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_staff();
