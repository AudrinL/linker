-- =============================================================================
-- Data retention.
--
-- Run this AFTER 0003_content.sql. It is a separate file because it needs the
-- `pg_cron` extension: if that is unavailable on your plan this file fails on
-- its first statement, and keeping it apart means 0003 is already committed and
-- the dashboard already works when it does.
--
-- WHY THIS EXISTS
--
-- The FastAPI backend stored these records in DynamoDB with a TTL attribute, so
-- expiry was a property of the storage and happened whether anyone remembered
-- it or not:
--
--     inquiries      30 days
--     applications  365 days
--     subscribers   180 days
--
-- Postgres has no equivalent. Moving to Supabase silently turned a system that
-- forgot old personal data into one that keeps every passport-adjacent detail
-- an applicant ever typed, forever. These are real people's identity documents
-- and travel plans, so the policy is restored explicitly rather than quietly
-- dropped. The windows are the ones the old service used — change them here if
-- the business wants different, but change them deliberately.
--
-- Deletion is by `created_at`, matching the old behaviour: the TTL was stamped
-- at write time and never extended on update.
-- =============================================================================

create extension if not exists pg_cron;


-- One function rather than three jobs, so the windows sit together and a change
-- to the policy is a single edit.
create or replace function private.purge_expired()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.inquiries
   where created_at < now() - interval '30 days';

  delete from public.applications
   where created_at < now() - interval '365 days';

  -- Only ever-unsubscribed or long-idle addresses. A live subscriber is not
  -- stale data, so the window is measured from sign-up exactly as before.
  delete from public.subscribers
   where created_at < now() - interval '180 days';
end;
$$;


-- 03:00 UTC — outside Kigali office hours, so a long delete never competes with
-- someone triaging a queue.
select cron.unschedule('purge-expired')
 where exists (select 1 from cron.job where jobname = 'purge-expired');

select cron.schedule('purge-expired', '0 3 * * *', $$select private.purge_expired()$$);


-- Check it registered:
--   select jobname, schedule, active from cron.job;
--
-- Run it once by hand without waiting for 03:00:
--   select private.purge_expired();
