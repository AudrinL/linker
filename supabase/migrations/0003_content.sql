-- =============================================================================
-- Applications, inquiries, subscribers and the journal.
--
-- These four tables replace the FastAPI backend. The shapes mirror the Pydantic
-- models that used to define them (backend/app/schemas.py) so the dashboard's
-- TypeScript types carry over unchanged.
--
-- Run this once in the Supabase SQL editor, after 0001 and 0002.
--
-- The access model is the important part. There is no service-role key in this
-- application and no server-to-server bearer token: every query runs either as
-- `anon` (a visitor submitting a form) or as `authenticated` (a signed-in
-- member of staff). Row-level security is therefore the whole of the
-- authorisation story, and it is stricter than the bearer token it replaces —
-- that key granted all-or-nothing access to every record, where these policies
-- distinguish submitting from reading.
-- =============================================================================


-- ------------------------------------------------------------------- helper
-- Approved staff only. Suspended and pending accounts are not staff for the
-- purposes of reading client data — the same rule the dashboard enforces in
-- `currentStaff()`, expressed where it cannot be bypassed.
--
-- security definer so the policies below can consult `staff` without needing a
-- select policy on it, and without recursing.
--
-- The schema is created by 0001; repeated here so running this file against a
-- project where that step was skipped fails on the missing `staff` table, with
-- a message that says so, rather than on a missing schema.
create schema if not exists private;

create or replace function private.is_approved_staff()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff
    where id = (select auth.uid())
      and status = 'approved'
  );
$$;


-- ------------------------------------------------------------------ inquiries
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text not null default 'other'
    check (service in ('work','study','travel','visa','flights','employer','other')),
  message text not null,
  source text,
  status text not null default 'new'
    check (status in ('new','in_review','contacted','approved','rejected','archived')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- --------------------------------------------------------------- applications
-- `answers` is the funnel's free-form question/answer map — the funnels differ
-- per service, so it stays a document rather than becoming columns. It is
-- named `answers` and not `values` because `values` is a reserved word in SQL
-- and every query touching it would need quoting; the dashboard maps it back
-- to `values` at the edge.
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  form_id text not null,
  service text not null default 'other'
    check (service in ('work','study','travel','visa','flights','employer','other')),
  reference text not null,
  name text not null,
  email text not null,
  phone text,
  destination text,
  answers jsonb not null default '{}'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  consents jsonb not null default '[]'::jsonb,
  status text not null default 'new'
    check (status in ('new','in_review','contacted','approved','rejected','archived')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ---------------------------------------------------------------- subscribers
-- Keyed on the address so re-subscribing is an upsert, not a duplicate.
create table if not exists public.subscribers (
  email text primary key,
  source text,
  unsubscribed boolean not null default false,
  created_at timestamptz not null default now()
);


-- ----------------------------------------------------------------------- posts
create table if not exists public.posts (
  slug text primary key,
  title text not null,
  excerpt text not null default '',
  category text not null default 'News',
  author text not null default 'Linker World Travel',
  read_time text not null default '5 min read',
  hero_image text,
  tags text[] not null default '{}',
  sections jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ------------------------------------------------------------------ timestamps
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inquiries_updated_at on public.inquiries;
create trigger inquiries_updated_at before update on public.inquiries
  for each row execute procedure public.touch_updated_at();

drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at before update on public.applications
  for each row execute procedure public.touch_updated_at();

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts
  for each row execute procedure public.touch_updated_at();


-- ------------------------------------------------------------------- indexes
-- The dashboard lists newest-first and filters on status; the public journal
-- lists published posts by date.
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists posts_published_idx on public.posts (published, published_at desc);


-- ------------------------------------------------------------------ policies
alter table public.inquiries enable row level security;
alter table public.applications enable row level security;
alter table public.subscribers enable row level security;
alter table public.posts enable row level security;

-- Anyone may submit. This is the public contact form and the funnels, so the
-- insert has to be open — but only the insert. A visitor cannot read back what
-- they or anyone else submitted, which is the property the old bearer token
-- did not actually provide.
drop policy if exists "anyone may submit an inquiry" on public.inquiries;
create policy "anyone may submit an inquiry"
  on public.inquiries for insert to anon, authenticated with check (true);

drop policy if exists "anyone may submit an application" on public.applications;
create policy "anyone may submit an application"
  on public.applications for insert to anon, authenticated with check (true);

drop policy if exists "anyone may subscribe" on public.subscribers;
create policy "anyone may subscribe"
  on public.subscribers for insert to anon, authenticated with check (true);

-- Deliberately no update policy for anon. Re-subscribing is handled as
-- INSERT ... ON CONFLICT DO NOTHING, so a repeat sign-up needs no write to the
-- existing row. Granting update here would let anyone who guessed an address
-- rewrite that subscriber — including unsubscribing them.

-- Staff read and triage everything.
drop policy if exists "staff read inquiries" on public.inquiries;
create policy "staff read inquiries"
  on public.inquiries for select to authenticated
  using ( (select private.is_approved_staff()) );

drop policy if exists "staff update inquiries" on public.inquiries;
create policy "staff update inquiries"
  on public.inquiries for update to authenticated
  using ( (select private.is_approved_staff()) )
  with check ( (select private.is_approved_staff()) );

drop policy if exists "staff read applications" on public.applications;
create policy "staff read applications"
  on public.applications for select to authenticated
  using ( (select private.is_approved_staff()) );

drop policy if exists "staff update applications" on public.applications;
create policy "staff update applications"
  on public.applications for update to authenticated
  using ( (select private.is_approved_staff()) )
  with check ( (select private.is_approved_staff()) );

drop policy if exists "staff read subscribers" on public.subscribers;
create policy "staff read subscribers"
  on public.subscribers for select to authenticated
  using ( (select private.is_approved_staff()) );

-- The journal: published posts are public, drafts are staff-only, and staff
-- write. Two select policies rather than one with an OR, because PostgreSQL
-- combines permissive policies with OR anyway and this reads plainer.
drop policy if exists "published posts are public" on public.posts;
create policy "published posts are public"
  on public.posts for select to anon, authenticated
  using ( published = true );

drop policy if exists "staff read every post" on public.posts;
create policy "staff read every post"
  on public.posts for select to authenticated
  using ( (select private.is_approved_staff()) );

drop policy if exists "staff write posts" on public.posts;
create policy "staff write posts"
  on public.posts for all to authenticated
  using ( (select private.is_approved_staff()) )
  with check ( (select private.is_approved_staff()) );


-- ------------------------------------------------------------------- grants
-- RLS decides the rows; these decide the verbs. Deliberately no delete for
-- anon anywhere, and no select on the intake tables.
grant insert on public.inquiries to anon, authenticated;
grant insert on public.applications to anon, authenticated;
grant insert on public.subscribers to anon, authenticated;
grant select on public.posts to anon, authenticated;

grant select, update on public.inquiries to authenticated;
grant select, update on public.applications to authenticated;
grant select on public.subscribers to authenticated;
grant insert, update, delete on public.posts to authenticated;
