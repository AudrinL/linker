/**
 * Newsletter sign-up. See `api/inquiries` for why the browser never writes to
 * the database directly.
 *
 * Keyed on the address, so re-subscribing is a no-op rather than a duplicate
 * row or a visible error.
 *
 * The write goes through `subscribe_email` (migration 0007) rather than a
 * table insert. An upsert done directly needs SELECT on `subscribers`, because
 * `ON CONFLICT DO UPDATE` has to read the row it collides with — and SELECT is
 * exactly what a visitor must not have on the mailing list. The function runs
 * as its owner, so the caller needs no rights on the table at all.
 *
 * It also means this route cannot express anything except "subscribe this
 * address": `unsubscribed` is hard-coded inside the function, so neither this
 * handler nor anyone calling the endpoint directly can use it to unsubscribe
 * somebody.
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
    const { error } = await supabase.rpc("subscribe_email", {
      p_email: checked.value.email,
      p_source: checked.value.source,
    });

    // 23505 would mean a duplicate slipped past the function's own conflict
    // handling — still the outcome the person asked for, so it is not an error
    // to show them.
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
