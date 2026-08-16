-- =============================================================================
-- Take back the read privilege `anon` never needed.
--
-- Run this AFTER 0003_content.sql. It is safe to run more than once.
--
-- WHY
--
-- Supabase grants `anon` and `authenticated` full table privileges on new
-- tables in `public` by default, so 0003's `grant insert ...` did not restrict
-- anything — it added to a set that already included SELECT. Probing the live
-- project as an anonymous caller returns `200 []` rather than `401`, which is
-- the visible symptom: the request is permitted and row-level security is the
-- only thing returning nothing.
--
-- RLS is working — verified with real rows in the table, an anonymous read
-- returns an empty array and a count of zero. But it is then the *single*
-- control protecting applicants' identity documents and the mailing list. One
-- policy written with `to public` instead of `to authenticated`, or one
-- `disable row level security` typed during a debugging session, and every
-- record is readable by anyone holding the publishable key — which is public by
-- design and sits in the browser bundle.
--
-- Revoking the grant puts a second, independent lock on that door. Nothing in
-- the application loses anything: visitors only ever insert, and staff read as
-- `authenticated`.
-- =============================================================================

-- Visitors submit; they never read. `posts` is deliberately excluded — the
-- public journal is meant to be readable, and its policy already limits that
-- to published rows.
revoke select on public.inquiries from anon;
revoke select on public.applications from anon;
revoke select on public.subscribers from anon;

-- Nothing anonymous ever updates or deletes.
revoke update, delete on public.inquiries from anon;
revoke update, delete on public.applications from anon;
revoke update, delete on public.subscribers from anon;
revoke insert, update, delete on public.posts from anon;

-- Staff never delete client records either: retention is what removes them
-- (0004_retention.sql), so that the window is a policy rather than a habit.
revoke delete on public.inquiries from authenticated;
revoke delete on public.applications from authenticated;

-- Verify — every one of these should return zero rows once this has run:
--
--   select grantee, table_name, privilege_type
--     from information_schema.role_table_grants
--    where table_schema = 'public'
--      and grantee = 'anon'
--      and table_name in ('inquiries','applications','subscribers')
--      and privilege_type = 'SELECT';
