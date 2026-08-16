/**
 * Public contact form intake.
 *
 * The browser posts here rather than to Supabase directly. That keeps the
 * site's CORS surface a single origin, keeps the honeypot and the size cap on
 * the server where a bot cannot skip them, and leaves the replies phrased for
 * a visitor rather than as database errors.
 *
 * The insert runs as `anon`, which row-level security allows to write this
 * table and not to read it — a visitor can submit an inquiry and cannot see
 * anyone else's.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { asObject, checkInquiry, isBot } from "@/lib/intake";

/** Same cap the old API enforced, applied before the body is read. */
const MAX_BODY_BYTES = 256 * 1024;

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Message too long." }, { status: 413 });
  }

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

  // Answer a bot exactly as we would a real submission, and store nothing.
  if (isBot(body)) return Response.json({ ok: true }, { status: 202 });

  const checked = checkInquiry(body);
  if (!checked.ok) {
    return Response.json({ ok: false, error: checked.error }, { status: 422 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("inquiries").insert(checked.value);
    if (error) {
      console.error("inquiry insert failed:", error.message);
      return Response.json(
        { ok: false, error: "We could not send that just now." },
        { status: 502 },
      );
    }
    return Response.json({ ok: true }, { status: 202 });
  } catch {
    return Response.json(
      { ok: false, error: "We could not reach our servers. Please use WhatsApp." },
      { status: 502 },
    );
  }
}
