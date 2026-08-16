/**
 * Where the emailed sign-in link lands.
 *
 * Exchanges the one-time code for a session, then sends the person on. The
 * redirect target is restricted to a path on this site: taking it raw from the
 * query string would make the callback an open redirect, and a sign-in link is
 * exactly the kind of URL people click without reading.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase/server";

function safeNext(raw: string | null): string {
  // Must be a single-slash-prefixed path. "//evil.com" and "https://evil.com"
  // are both rejected.
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (!supabaseConfigured() || !code) {
    return NextResponse.redirect(`${origin}/admin/login?error=link`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Expired or already-used link — both are ordinary and both say the same
    // thing to the person holding it.
    return NextResponse.redirect(`${origin}/admin/login?error=link`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
