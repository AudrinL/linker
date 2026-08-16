/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 *
 * A new client per request — it reads that request's cookies, so a shared
 * instance would leak one member of staff's session into another's response.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Read a `NEXT_PUBLIC_` value without letting the build freeze it.
 *
 * Next.js inlines `process.env.NEXT_PUBLIC_X` as a literal at build time, so a
 * build that ran before these were set bakes in an empty string — and the
 * deployment then reports itself unconfigured forever, no matter what the host
 * holds at runtime. The bracketed lookup is not a candidate for that
 * substitution, so it reads the environment the server actually has. The
 * inlined form is still tried first: it is what makes `.env` work in
 * development and what a static build would rely on.
 */
function publicEnv(inlined: string | undefined, name: string): string {
  return inlined || process.env[name] || "";
}

export const SUPABASE_URL = publicEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL",
);
export const SUPABASE_KEY = publicEnv(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
);

/** Both halves must be present before any Supabase code path is taken. */
export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. That is expected and
          // harmless: proxy.ts refreshes the tokens on the way in, so the
          // only thing lost here is a duplicate write.
        }
      },
    },
  });
}
