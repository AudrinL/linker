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

export type Role = "super_admin" | "staff";
export type AccountStatus = "pending" | "approved" | "suspended";

export type Staff = {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  status: AccountStatus;
  via: "supabase" | "password";
  /**
   * True until the account has set its own password through the dashboard.
   *
   * A temporary password is issued by an administrator, which means at least
   * two people know it and it has probably travelled through a chat window.
   * Until it is replaced, the account is treated as not yet fully theirs and
   * every dashboard route bounces to the change-password screen.
   */
  mustChangePassword: boolean;
};

/**
 * Secret behind the local-only shared-password fallback.
 *
 * This was the bearer token for the FastAPI backend. That backend is gone —
 * the dashboard reads Supabase directly now, authenticated as the signed-in
 * member of staff — so the key no longer authorises anything on its own and is
 * not needed by any deployment. All that remains is its second job: seeding
 * `ADMIN_PASSWORD` and `SESSION_SECRET` when neither is set, so the offline
 * dev login works with nothing configured.
 *
 * Every caller is behind `passwordLoginAllowed()`, which is false in
 * production, so this cannot throw on a deployed site.
 */
export function adminApiKey(): string {
  const key = process.env.ADMIN_API_KEY;
  if (!key) throw new Error("ADMIN_API_KEY is not set");
  return key;
}

/**
 * The `ADMIN_EMAILS` environment allowlist is gone.
 *
 * It was the right answer while there was nowhere to record who works here.
 * Now the `staff` table is that record: a new account arrives as 'pending' and
 * can see nothing until a super admin approves it, which is a stronger version
 * of the same guarantee — open sign-ups are safe because signing up grants
 * nothing. It also survives someone editing an environment variable, and it
 * lets access be revoked without a redeploy.
 */

/**
 * Pull the email out of a verified claims payload.
 *
 * Written defensively because the published reference does not pin the
 * nesting: some versions hand back `{ claims }`, others the payload itself.
 * Both are read rather than betting on one and failing closed at 3am.
 */
function claimsOf(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};
  const outer = data as Record<string, unknown>;
  return (outer.claims ?? outer) as Record<string, unknown>;
}

function emailFromClaims(data: unknown): string | undefined {
  const email = claimsOf(data).email;
  return typeof email === "string" ? email : undefined;
}

function subFromClaims(data: unknown): string | undefined {
  const sub = claimsOf(data).sub;
  return typeof sub === "string" ? sub : undefined;
}

/**
 * Marker written when the account sets its own password. Its presence is the
 * whole test — absent means "still on the password someone else issued".
 */
export const PASSWORD_CHANGED_AT = "password_changed_at";

function hasChangedPassword(data: unknown): boolean {
  const metadata = claimsOf(data).user_metadata;
  if (!metadata || typeof metadata !== "object") return false;
  return Boolean((metadata as Record<string, unknown>)[PASSWORD_CHANGED_AT]);
}

// ------------------------------------------------------------------ Supabase

async function supabaseStaff(): Promise<Staff | null> {
  if (!supabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  // getClaims, not getSession: it verifies the JWT signature against the
  // project's published keys. getSession trusts whatever is in the cookie.
  const { data, error } = await supabase.auth.getClaims();
  if (error) return null;

  const id = subFromClaims(data);
  const email = emailFromClaims(data);
  if (!id || !email) return null;

  // Role and status come from the database, never from the token. A JWT is
  // reissued on refresh but a demotion or suspension must bite immediately —
  // reading the row on each request is what makes "remove access now" true.
  const { data: row, error: rowError } = await supabase
    .from("staff")
    .select("id, email, full_name, role, status")
    .eq("id", id)
    .maybeSingle();

  if (rowError) {
    // Almost always the migration not having been run. Deny, loudly.
    console.error(
      "Could not read the staff table — has supabase/migrations/0001_staff_accounts.sql been run?",
      rowError.message,
    );
    return null;
  }

  // Authenticated but no staff row: the trigger did not fire, or the row was
  // removed. Either way this is not a member of staff.
  if (!row) return null;

  return {
    id,
    email: row.email ?? email,
    fullName: row.full_name ?? null,
    role: row.role as Role,
    status: row.status as AccountStatus,
    via: "supabase",
    mustChangePassword: !hasChangedPassword(data),
  };
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
      // The dev fallback has no account behind it — nothing to change, and it
      // is treated as a super admin so the whole dashboard stays reachable
      // while working offline.
      return {
        id: "local",
        email: "local development",
        fullName: null,
        role: "super_admin",
        status: "approved",
        via: "password",
        mustChangePassword: false,
      };
    }
  }

  return null;
}

/** A session alone is not access — only an approved account may see data. */
export function isApproved(staff: Staff | null): staff is Staff {
  return staff !== null && staff.status === "approved";
}

export async function hasSession(): Promise<boolean> {
  return isApproved(await currentStaff());
}
