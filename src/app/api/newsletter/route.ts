/**
 * Newsletter sign-up. See `api/inquiries` for why the browser never writes to
 * the database directly.
 *
 * Keyed on the address, so re-subscribing is a no-op rather than a duplicate
 * row or a visible error.
 *
 * `ignoreDuplicates` makes this INSERT ... ON CONFLICT DO NOTHING, which needs
 * only the insert privilege. A true upsert would need `anon` to hold UPDATE on
 * this table, and that is a hole: anyone who guessed an address could then
 * rewrite that row and unsubscribe a real subscriber. The cost is that someone
 * who previously unsubscribed stays unsubscribed until staff clear the flag,
 * which is the right way round for a mailing list.
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
    const { error } = await supabase
      .from("subscribers")
      .upsert(checked.value, { onConflict: "email", ignoreDuplicates: true });
    if (error) {
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
