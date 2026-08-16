/**
 * Who is allowed into the staff dashboard.
 *
 * Supabase authenticates the person; `ADMIN_API_KEY` remains a server-to-server
 * credential for the FastAPI backend and never reaches a browser. Those are two
 * separate concerns and are deliberately not merged: a member of staff signing
 * in does not hand them the API key, and rotating the key does not sign anyone
 * out.
 *
 * The gate is enforced here — called from every page, action and route handler.
 * `proxy.ts` only refreshes tokens. That split matters: this Next.js version is
 * covered by a published proxy-bypass advisory, and an auth check that lives
 * only in the proxy would be defeated by it.
 *
 * A legacy shared-password path survives for local development when Supabase is
 * not configured, so the dashboard still runs with no cloud dependency. It is
 * refused outright in production — see `passwordLoginAllowed`.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase/server";

export const SESSION_COOKIE = "lwt_admin";

/** Eight hours — a working day, so a shift is not logged out mid-task. */
const SESSION_MAX_AGE = 8 * 60 * 60;

export type Staff = { email: string; via: "supabase" | "password" };

/**
 * The bearer token sent to the FastAPI backend. Server-only: this module is
 * never imported from a Client Component.
 */
export function adminApiKey(): string {
  const key = process.env.ADMIN_API_KEY;
  if (!key) throw new Error("ADMIN_API_KEY is not set");
  return key;
}

/**
 * The addresses allowed into the dashboard. Required — not optional.
 *
 * An empty list denies everyone. That looks harsh until you follow the path it
 * closes: the publishable key is public by design, so anyone can create an
 * account directly against the Supabase project unless sign-ups are disabled
 * there. `shouldCreateUser: false` stops *this* login form creating accounts,
 * but it cannot stop an account that already exists from requesting a link and
 * receiving a genuine session.
 *
 * "Authenticated" therefore does not mean "staff". This list is what means
 * staff, and it is the one check that does not depend on a setting in a
 * dashboard nobody re-reads. Fail closed: a missing list locks the office out
 * for as long as it takes to set an environment variable, which is a far better
 * afternoon than the alternative.
 */
export function allowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowed(email: string | undefined): email is string {
  if (!email) return false;
  const allowed = allowlist();
  if (allowed.length === 0) {
    console.error(
      "ADMIN_EMAILS is not set — refusing all dashboard sign-ins. " +
        "Set it to the comma-separated staff addresses.",
    );
    return false;
  }
  return allowed.includes(email.toLowerCase());
}

/**
 * Pull the email out of a verified claims payload.
 *
 * Written defensively because the published reference does not pin the
 * nesting: some versions hand back `{ claims }`, others the payload itself.
 * Both are read rather than betting on one and failing closed at 3am.
 */
function emailFromClaims(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const outer = data as Record<string, unknown>;
  const claims = (outer.claims ?? outer) as Record<string, unknown>;
  const email = claims.email;
  return typeof email === "string" ? email : undefined;
}

// ------------------------------------------------------------------ Supabase

async function supabaseStaff(): Promise<Staff | null> {
  if (!supabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  // getClaims, not getSession: it verifies the JWT signature against the
  // project's published keys. getSession trusts whatever is in the cookie.
  const { data, error } = await supabase.auth.getClaims();
  if (error) return null;

  const email = emailFromClaims(data);
  return isAllowed(email) ? { email, via: "supabase" } : null;
}

export async function signOutSupabase(): Promise<void> {
  if (!supabaseConfigured()) return;
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

// ------------------------------------------- legacy shared-password fallback

/**
 * The password path exists only when Supabase is not configured *and* we are
 * not in production. Two conditions, so a missing env var in a production
 * deploy fails closed rather than silently re-opening a shared password.
 */
export function passwordLoginAllowed(): boolean {
  return !supabaseConfigured() && process.env.NODE_ENV !== "production";
}

function loginPassword(): string {
  return process.env.ADMIN_PASSWORD || adminApiKey();
}

function signingSecret(): string {
  return process.env.SESSION_SECRET || adminApiKey();
}

function sign(payload: string): string {
  return createHmac("sha256", signingSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  // timingSafeEqual throws on a length mismatch, which would itself leak the
  // length, so compare lengths first.
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function checkPassword(candidate: string): boolean {
  if (!passwordLoginAllowed()) return false;
  return safeEqual(candidate, loginPassword());
}

function mint(): string {
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, mint(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  await signOutSupabase();
}

// -------------------------------------------------------------------- shared

/** The one question every guarded surface asks. */
export async function currentStaff(): Promise<Staff | null> {
  const staff = await supabaseStaff();
  if (staff) return staff;

  if (passwordLoginAllowed()) {
    const store = await cookies();
    if (isValidToken(store.get(SESSION_COOKIE)?.value)) {
      return { email: "local development", via: "password" };
    }
  }

  return null;
}

export async function hasSession(): Promise<boolean> {
  return (await currentStaff()) !== null;
}
