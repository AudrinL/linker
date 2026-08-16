/**
 * Mailing list export.
 *
 * This used to proxy a FastAPI endpoint that built the file. The endpoint is
 * gone, so the CSV is written here — including the two protections that came
 * with it, both of which matter more than they look:
 *
 * Every value is quoted and embedded quotes are doubled (RFC 4180). Both
 * columns are attacker-controlled — anyone may POST to /newsletter with
 * whatever `source` they like — and a single `"` was enough to forge extra
 * columns when the file was built by string concatenation.
 *
 * Values that begin `=`, `+`, `-` or `@` are prefixed with an apostrophe.
 * Staff open this in Excel, where such a cell is evaluated as a formula on
 * open: that is code execution on a staff laptop by way of a newsletter
 * sign-up. Excel hides the apostrophe, so the column still reads normally. Tab
 * and carriage return are included because Excel strips leading whitespace
 * before deciding what is a formula.
 */

import { adminApi, requireSession } from "@/lib/admin/api";

const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

function csvCell(value: string | null | undefined): string {
  const text = String(value ?? "");
  const safe = FORMULA_PREFIXES.includes(text.slice(0, 1)) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  // Redirects an expired session to the login screen; an approved account is
  // the only way past. The rows themselves are gated again by row-level
  // security, so a suspended account gets an empty file rather than a leak.
  await requireSession();

  let rows;
  try {
    rows = await adminApi.subscribers();
  } catch {
    return new Response("Could not export subscribers.", { status: 502 });
  }

  const lines = [
    ["email", "source", "created_at"].map(csvCell).join(","),
    ...rows.map((s) =>
      [csvCell(s.email), csvCell(s.source), csvCell(s.created_at)].join(","),
    ),
  ];
  // \r\n because that is what RFC 4180 specifies and what Excel expects.
  const body = `${lines.join("\r\n")}\r\n`;

  const date = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${date}.csv"`,
      // A mailing list should never sit in a shared cache.
      "Cache-Control": "no-store",
    },
  });
}
