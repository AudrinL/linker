/**
 * Multi-step application funnel intake.
 *
 * Same reasoning as `api/inquiries` — see the note there. Kept separate rather
 * than one generic handler so neither route can be pointed at another table.
 *
 * The applicant's own reference (`LWT-XXXXXX`) is generated in the browser and
 * shown on the success screen; it is stored as sent so staff and applicant
 * quote the same number.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { asObject, checkApplication, isBot } from "@/lib/intake";

const MAX_BODY_BYTES = 256 * 1024;

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Submission too large." }, { status: 413 });
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

  if (isBot(body)) return Response.json({ ok: true }, { status: 202 });

  const checked = checkApplication(body);
  if (!checked.ok) {
    return Response.json({ ok: false, error: checked.error }, { status: 422 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("applications").insert(checked.value);
    if (error) {
      console.error("application insert failed:", error.message);
      return Response.json(
        { ok: false, error: "We could not save that just now." },
        { status: 502 },
      );
    }
    return Response.json({ ok: true }, { status: 202 });
  } catch {
    return Response.json(
      { ok: false, error: "We could not reach our servers." },
      { status: 502 },
    );
  }
}
