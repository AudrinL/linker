/**
 * Newsletter sign-up. See `api/inquiries` for why the browser never writes to
 * the database directly.
 *
 * Keyed on the address, so re-subscribing is a no-op rather than a duplicate
 * row or a visible error.
 *
 * An upsert, so someone who unsubscribed and changed their mind comes back on
 * the list. Insert-only looked safer but told that person "you're signed up"
 * and left them unsubscribed.
 *
 * It needs the UPDATE privilege granted in 0006, which is column-level and
 * paired with a policy allowing only `unsubscribed = false` — an anonymous
 * write can re-subscribe an address but never unsubscribe one, so a walk
 * through a list of addresses cannot empty the mailing list.
 *
 * `unsubscribed` is sent explicitly rather than left to the column default:
 * on the conflict path there is no default to apply, and omitting it would
 * make the re-subscribe a no-op again.
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
      .upsert(
        { ...checked.value, unsubscribed: false },
        { onConflict: "email" },
      );

    // 23505 would mean the upsert fell through to a plain conflict — kept as a
    // success because "you are already on the list" is the outcome the person
    // asked for either way.
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
