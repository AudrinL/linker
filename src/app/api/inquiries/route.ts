/**
 * Server-side proxy for the public contact form.
 *
 * The browser posts here, not to the API directly: it keeps `API_BASE_URL` off
 * the client, leaves room to attach a server-held credential later without
 * touching the form, and means the site's CORS surface stays a single origin.
 *
 * Validation stays in FastAPI — duplicating it here would give two answers to
 * the same question. This handler forwards and translates the result.
 */

import { API_BASE_URL } from "@/lib/admin/api";

/** Matches the backend's own cap, so an oversized body fails here first. */
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

  try {
    const upstream = await fetch(`${API_BASE_URL}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!upstream.ok) {
      // 422 means the applicant's own input was rejected; anything else is
      // ours to fix, and either way they get a plain sentence, not a stack.
      return Response.json(
        {
          ok: false,
          error:
            upstream.status === 422
              ? "Please check the details and try again."
              : "We could not send that just now.",
        },
        { status: upstream.status === 422 ? 422 : 502 },
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
