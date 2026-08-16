-- =============================================================================
-- Let a re-subscribe actually re-subscribe.
--
-- Run this AFTER 0005_tighten_grants.sql.
--
-- WHAT WAS WRONG
--
-- Sign-up was insert-only, so an address already on the list conflicted and the
-- write was discarded. Fine for a plain duplicate — but someone who had
-- unsubscribed and changed their mind got a success message and stayed
-- unsubscribed, with nothing anywhere saying so.
--
-- Making it an upsert needs `anon` to hold UPDATE, which is what the earlier
-- attempt got refused for (42501). The privilege is granted here, as narrowly
-- as the feature allows:
--
--   * Column-level, on exactly the three columns the upsert writes. `created_at`
--     is deliberately excluded — it is what the retention job in 0004 measures
--     from, and a writable created_at would let anyone keep a record alive past
--     its expiry window.
--
--   * `with check (unsubscribed = false)` means an anonymous write can only ever
--     leave a row *subscribed*. The damaging direction — walking a list of
--     addresses and unsubscribing all of them — is refused by the policy.
--
-- THE RESIDUAL TRADE-OFF, STATED PLAINLY
--
-- Anyone who knows an address can now flip it from unsubscribed back to
-- subscribed. That overrides someone's explicit opt-out, which is the part that
-- matters legally, and no policy can distinguish it from a genuine change of
-- mind because nothing here proves control of the inbox.
--
-- It is a small step from where things already stand: insert is open to
-- everyone, so anyone could always add any address to this list. Confirming
-- sign-ups by email is what actually closes both holes, and is the right fix
-- when the newsletter is worth that work.
-- =============================================================================

grant update (email, source, unsubscribed) on public.subscribers to anon, authenticated;

drop policy if exists "anyone may resubscribe" on public.subscribers;
create policy "anyone may resubscribe"
  on public.subscribers for update to anon, authenticated
  using (true)
  with check (unsubscribed = false);

-- Verify the policy refuses the harmful direction. As an anonymous caller,
-- PATCHing a row to unsubscribed=true should return 401, and to
-- unsubscribed=false should return 204.
