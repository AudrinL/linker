/**
 * Server-side proxy for newsletter sign-ups. See `api/inquiries` for why the
 * browser never talks to the backend directly.
 */

import { API_BASE_URL } from "@/lib/admin/api";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${API_BASE_URL}/newsletter`, {
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
              ? "That email address does not look right."
              : "We could not sign you up just now.",
        },
        { status: upstream.status === 422 ? 422 : 502 },
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ ok: false, error: "We could not reach our servers." }, {
      status: 502,
    });
  }
}
