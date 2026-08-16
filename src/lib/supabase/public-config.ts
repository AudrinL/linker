/**
 * Where the public Supabase values come from, and in what order.
 *
 * Both of these are public by design. `NEXT_PUBLIC_` means "inline this into
 * the browser bundle", so any working deployment serves them to every visitor
 * already; the publishable key carries no privilege of its own and every row
 * it can reach is governed by row-level security. Committing them exposes
 * nothing that a working deployment does not hand out anyway.
 *
 * They live here rather than only in the environment because a value that
 * exists solely in a gitignored `.env` cannot reach a deployment: the host
 * never sees that file, so the site builds with an empty string and reports
 * itself unconfigured. Carrying the defaults in the repo is what makes a fresh
 * deploy work with no dashboard configuration at all.
 *
 * The environment still wins where it is set, so nothing here has to be edited
 * to point a deploy at a different project — set the variables on the host and
 * these become dead weight.
 *
 * What must NOT join them: `ADMIN_API_KEY`, `SESSION_SECRET`, and the Supabase
 * *secret* (service-role) key. Those are real credentials, they are never
 * prefixed `NEXT_PUBLIC_`, and they stay in the environment.
 *
 * This module is imported by the edge proxy as well as the server, so it must
 * not pull in `next/headers` or anything else Node-only.
 */

const DEFAULT_URL = "https://eryvdggjapnuqbsozhpi.supabase.co";
const DEFAULT_KEY = "sb_publishable_1rW1uPhEgerAkPe7w-b9Uw_7gZrwpmK";

/**
 * Resolve one value: build-time inlined, then the live environment, then the
 * committed default.
 *
 * `name` arrives as an argument rather than being written at the access site
 * on purpose. Next.js inlines `process.env.NEXT_PUBLIC_X` *and*
 * `process.env["NEXT_PUBLIC_X"]` when the key is a literal, freezing whatever
 * the build saw. Reaching the variable through a parameter is what keeps the
 * second step an actual runtime read instead of a second copy of the first.
 */
function resolve(
  inlined: string | undefined,
  name: string,
  fallback: string,
): string {
  return inlined || process.env[name] || fallback;
}

export const SUPABASE_URL = resolve(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL",
  DEFAULT_URL,
);

export const SUPABASE_KEY = resolve(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  DEFAULT_KEY,
);

/**
 * Both halves must be present before any Supabase code path is taken.
 *
 * With defaults compiled in this is now true everywhere, which is the point:
 * the unconfigured screen was only ever reachable because the values could go
 * missing. It stays as the guard rather than being deleted, so that blanking
 * the defaults for a fork or a different project degrades to a clear message
 * instead of a crash.
 */
export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

/** Which source each value actually came from. Read by the unconfigured screen. */
export type EnvDiagnosis = {
  buildCommit: string;
  vars: { name: string; atBuild: boolean; atRuntime: boolean }[];
};

export function supabaseEnvDiagnosis(): EnvDiagnosis {
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
