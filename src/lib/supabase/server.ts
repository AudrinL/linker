/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 *
 * A new client per request — it reads that request's cookies, so a shared
 * instance would leak one member of staff's session into another's response.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

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
