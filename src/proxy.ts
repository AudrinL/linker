/**
 * Token refresh only — never the authorisation gate.
 *
 * Supabase access tokens are short-lived, and Server Components cannot write
 * cookies. This runs before the render, refreshes the session, and hands the
 * new tokens both inward (to the render) and outward (to the browser).
 *
 * It deliberately does **not** decide who may see `/admin`. That check lives in
 * `currentStaff()` and is called by every page, Server Action and route
 * handler. Keeping it there rather than here is what makes the dashboard safe
 * against proxy-bypass bugs — this Next.js version has a published advisory for
 * exactly that class of issue.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // The bracketed reads are the fallback for a deployment whose build ran
  // before the variables were set — see `publicEnv` in lib/supabase/server.
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
  // Not configured — local development on the password fallback. Nothing to
  // refresh, so get out of the request's way.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // The call itself is the refresh — the claims are read where they matter.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  /**
   * The dashboard and its API routes, and nothing else.
   *
   * This used to match the whole site minus static assets, which was harmless
   * only while Supabase was unconfigured and the function returned on the
   * first line. With it configured, `getClaims()` verifies a JWT against the
   * project's published keys — a network fetch of the key set on any instance
   * that has not cached it yet. Matching every route meant paying that on the
   * homepage, on every marketing page, for visitors who have no session and
   * never will.
   *
   * Nothing outside `/admin` reads a staff session, so nothing outside it
   * needs the refresh. Narrowing the matcher is also what keeps the excluded
   * static-asset list from being load-bearing.
   */
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
