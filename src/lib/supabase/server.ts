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

/**
 * Why sign-in is unconfigured, in enough detail to end the guessing.
 *
 * "Set the variables and redeploy" is useless advice once you have set the
 * variables and redeployed. Each value can be missing in two distinct ways and
 * the fix differs: absent at build means the build ran without them (never set,
 * set after the last deploy, or scoped so the build cannot see them); absent at
 * runtime means the function cannot see them (scoped to builds only). Present
 * at runtime but not at build is the normal, working state for a deployment
 * configured after its last build — the fallback in `publicEnv` covers it.
 *
 * `buildCommit` is Netlify's `COMMIT_REF`, captured at build time in
 * next.config.ts. It answers the question no amount of code reading can: which
 * commit is actually serving this page. A value behind `git rev-parse HEAD`
 * means the deploy is stale and nothing in the source explains the symptom.
 *
 * Only presence is reported, never a value — though both of these are public by
 * design, this keeps the habit right.
 */
export type EnvDiagnosis = {
  buildCommit: string;
  vars: { name: string; atBuild: boolean; atRuntime: boolean }[];
};

export function supabaseEnvDiagnosis(): EnvDiagnosis {
  // `atBuild` must be the inlined literal and `atRuntime` must NOT be, or both
  // report the same number and the panel lies. A bracketed lookup is only safe
  // from substitution when the key is not a literal at the access site, which
  // is why the name arrives through this variable rather than being written
  // out — the same reason `publicEnv` takes its name as an argument.
  const inlined: Record<string, string | undefined> = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };

  return {
    buildCommit: (process.env.BUILD_COMMIT || "unknown").slice(0, 7),
    vars: Object.keys(inlined).map((name) => ({
      name,
      atBuild: Boolean(inlined[name]),
      atRuntime: Boolean(process.env[name]),
    })),
  };
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
