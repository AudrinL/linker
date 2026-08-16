/**
 * Server-side proxy for the multi-step application funnels.
 *
 * Same reasoning as `api/inquiries` — see the note there. Kept separate rather
 * than one generic passthrough so neither route can be used to reach an
 * arbitrary backend path.
 */

import { API_BASE_URL } from "@/lib/admin/api";

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

  try {
    const upstream = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return Response.json(
        {
          ok: false,
          error:
            upstream.status === 422
              ? "Please check the details and try again."
              : "We could not save that just now.",
        },
        { status: upstream.status === 422 ? 422 : 502 },
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
