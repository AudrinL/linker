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
  // Static assets and image optimisation are excluded: without this the proxy
  // runs on every CSS, JS and image request, which is pure latency.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img/|.*\\.(?:png|jpe?g|svg|ico|webp|avif)$).*)"],
};
