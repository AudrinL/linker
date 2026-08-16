-- =============================================================================
-- Newsletter sign-up as a function, and the retirement of 0006.
--
-- Run this AFTER 0006_newsletter_upsert.sql. It undoes the grant that file made.
--
-- WHY 0006 COULD NOT WORK
--
-- `INSERT ... ON CONFLICT DO UPDATE` has to read the row it collides with, so
-- Postgres requires SELECT on the table — not just INSERT and UPDATE. 0005
-- revoked SELECT from `anon` precisely so that a visitor cannot read the
-- mailing list, and that revoke is worth keeping. Verified against the live
-- project: the upsert returns 42501 with the hint
-- `GRANT SELECT ON public.subscribers TO anon`.
--
-- Granting SELECT back to make the upsert work would trade the whole
-- subscriber list for a convenience. So the upsert moves somewhere it does not
-- need the caller's privileges at all.
--
-- WHAT THIS DOES INSTEAD
--
-- A `security definer` function runs as its owner, so it is not subject to the
-- policies on `subscribers`. The caller needs no rights on the table — only
-- permission to run this one function, which accepts an address and a source
-- and can do nothing else. That is a smaller grant than 0006 asked for and a
-- smaller one than the plain insert needs:
--
--   * It cannot be used to read the list — it returns nothing.
--   * It cannot unsubscribe anyone: `unsubscribed` is hard-coded false, not
--     taken from the caller. The policy in 0006 tried to enforce this and is
--     now unnecessary.
--   * It cannot touch `created_at`, so the retention window in 0004 stands.
--
-- The opt-out trade-off noted in 0006 remains: re-subscribing an address that
-- had unsubscribed is still possible for anyone who knows it, because nothing
-- here proves control of the inbox. Confirming sign-ups by email is what fixes
-- that, and is a separate piece of work.
-- =============================================================================

create or replace function public.subscribe_email(
  p_email  text,
  p_source text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Lowercased here as well as in the route: this function is the boundary, and
  -- a mixed-case address would defeat the primary key and create a duplicate.
  insert into public.subscribers (email, source, unsubscribed)
  values (lower(trim(p_email)), nullif(trim(coalesce(p_source, '')), ''), false)
  on conflict (email) do update
     set unsubscribed = false,
         -- Keep the original source when the new one is blank, so a repeat
         -- sign-up from a page that does not set it cannot erase the record of
         -- where someone first came from.
         source = coalesce(excluded.source, public.subscribers.source);
end;
$$;

grant execute on function public.subscribe_email(text, text) to anon, authenticated;


-- ------------------------------------------------- undo 0006's table privilege
-- No longer needed, and it was the part that let an anonymous caller write to
-- an existing row at all.
drop policy if exists "anyone may resubscribe" on public.subscribers;
revoke update (email, source, unsubscribed) on public.subscribers from anon, authenticated;


-- Verify:
--   select public.subscribe_email('someone@example.com', 'test');
--   select email, source, unsubscribed from public.subscribers
--    where email = 'someone@example.com';
--   -- run it twice; there should be one row, and unsubscribed should be false.
