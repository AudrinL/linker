/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 *
 * A new client per request — it reads that request's cookies, so a shared
 * instance would leak one member of staff's session into another's response.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL } from "./public-config";

/**
 * The public values, their resolution order and the diagnosis of where they
 * came from all live in `public-config`, which the edge proxy imports too.
 * Re-exported here so every existing `from "@/lib/supabase/server"` import
 * keeps working, and there is still one obvious place to reach for them.
 */
export {
  SUPABASE_URL,
  SUPABASE_KEY,
  supabaseConfigured,
  supabaseEnvDiagnosis,
  type EnvDiagnosis,
} from "./public-config";

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
