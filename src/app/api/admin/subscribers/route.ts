/**
 * CSV export proxy.
 *
 * The backend's `/admin/subscribers.csv` needs the bearer key, which the
 * browser must never hold. This handler checks the staff session, fetches with
 * the key server-side, and streams the file back — so the download is an
 * ordinary link in the dashboard.
 */

import { API_BASE_URL } from "@/lib/admin/api";
import { adminApiKey, hasSession } from "@/lib/admin/session";

export async function GET() {
  if (!(await hasSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const upstream = await fetch(`${API_BASE_URL}/admin/subscribers.csv`, {
    headers: { Authorization: `Bearer ${adminApiKey()}` },
    cache: "no-store",
  });

  if (!upstream.ok) {
    return new Response("Could not export subscribers.", {
      status: upstream.status,
    });
  }

  const date = new Date().toISOString().slice(0, 10);
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${date}.csv"`,
      // A mailing list should never sit in a shared cache.
      "Cache-Control": "no-store",
    },
  });
}
