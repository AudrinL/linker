/**
 * Newsletter sign-up. See `api/inquiries` for why the browser never writes to
 * the database directly.
 *
 * Keyed on the address, so re-subscribing is a no-op rather than a duplicate
 * row or a visible error.
 *
 * A plain insert, with the duplicate caught below — deliberately not an upsert.
 * PostgREST's upsert is refused by row-level security here even in its
 * `ignore-duplicates` form (42501, verified against the live project), and the
 * fix is not to widen the policy: a working upsert would need `anon` to hold
 * UPDATE on this table, which would let anyone who guessed an address rewrite
 * that row and unsubscribe a real subscriber. Insert-only keeps the privilege
 * as narrow as the feature actually needs.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { asObject, checkSubscriber, isBot } from "@/lib/intake";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const body = asObject(payload);
  if (!body) {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (isBot(body)) return Response.json({ ok: true }, { status: 201 });

  const checked = checkSubscriber(body);
  if (!checked.ok) {
    return Response.json({ ok: false, error: checked.error }, { status: 422 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("subscribers").insert(checked.value);

    // 23505 is unique_violation: they are already on the list. That is the
    // successful outcome of "subscribe me", not an error to show them.
    if (error && error.code !== "23505") {
      console.error("subscribe failed:", error.message);
      return Response.json(
        { ok: false, error: "We could not sign you up just now." },
        { status: 502 },
      );
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { ok: false, error: "We could not reach our servers." },
      { status: 502 },
    );
  }
}
