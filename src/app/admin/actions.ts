"use server";

/**
 * Every mutation the dashboard performs.
 *
 * Server Actions are public HTTP endpoints, so each one re-checks the session
 * itself — being reachable only from a guarded page is not a guard.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, adminApi, requireSession } from "@/lib/admin/api";
import {
  PASSWORD_CHANGED_AT,
  checkPassword,
  currentStaff,
  endSession,
  passwordLoginAllowed,
  startSession,
} from "@/lib/admin/session";
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase/server";
import { STATUSES, type Status } from "@/lib/admin/types";

export type ActionState = { error?: string; ok?: boolean };

/**
 * Crude per-instance throttle on failed logins.
 *
 * Netlify runs several instances so this is not a hard limit — Supabase's own
 * auth rate limiting is the real backstop. It exists to make an online guessing
 * attempt slow enough to be pointless.
 *
 * The bucket is per address *and* per client IP. It used to be one global
 * bucket, which was wrong in both directions: five wrong guesses from anybody
 * locked out every member of staff for a minute — a one-line denial of service
 * on the dashboard — while a real attacker just spread their guesses across
 * instances and barely noticed. Keying on the pair means a locked bucket
 * affects exactly the address being attacked from the address attacking it.
 */
const attempts = new Map<string, { count: number; until: number }>();
const LOCKOUT_MS = 60_000;
const MAX_ATTEMPTS = 5;
/** Bounds the map, which is otherwise a slow memory leak on a long-lived instance. */
const MAX_TRACKED = 5_000;

/**
 * The client's address.
 *
 * `x-nf-client-connection-ip` is set by Netlify's edge from the real TCP peer
 * and cannot be forged by the caller. `x-forwarded-for` can be, so it is only
 * a local-development fallback — trusting it in production would let an
 * attacker rotate the header and get a fresh bucket per request.
 */
async function clientIp(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get("x-nf-client-connection-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function throttleKey(identity: string): Promise<string> {
  return `${identity}|${await clientIp()}`;
}

/** True when this bucket is currently locked out. */
function throttled(key: string): boolean {
  const record = attempts.get(key);
  return Boolean(record && record.count >= MAX_ATTEMPTS && Date.now() < record.until);
}

function recordFailure(key: string): void {
  if (attempts.size >= MAX_TRACKED) {
    // Drop everything already expired before growing further. If that clears
    // nothing, the map is genuinely under load — stop tracking rather than
    // grow without bound, and let Supabase's own limits carry it.
    const now = Date.now();
    for (const [k, v] of attempts) if (v.until <= now) attempts.delete(k);
    if (attempts.size >= MAX_TRACKED) return;
  }

  const record = attempts.get(key);
  const fresh = record && Date.now() < record.until ? record.count : 0;
  attempts.set(key, { count: fresh + 1, until: Date.now() + LOCKOUT_MS });
}

/**
 * Email a sign-in link.
 *
 * The reply is identical whether or not the address belongs to a member of
 * staff. Saying "no such user" here would turn the login screen into a way to
 * enumerate who works at the company.
 */
export async function sendMagicLink(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!supabaseConfigured()) {
    return { error: "Sign-in is not configured. Set the Supabase environment variables." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S{2,}$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const key = await throttleKey(email);
  if (throttled(key)) {
    return { error: "Too many attempts. Try again in a minute." };
  }
  // Every request counts here, not just failures: the reply is identical
  // either way, so there is no "failure" to detect, and the thing being
  // rationed is outbound mail to that address.
  recordFailure(key);

  // Built from the request's own host so the link works on localhost, on a
  // Netlify preview and in production without a hardcoded URL per environment.
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${protocol}://${host}/admin/auth/callback`,
      // Sign-in never creates an account — that is what /admin/signup is for.
      // Supabase therefore only mails an address that already registered, and
      // the resulting session still sees nothing until a super admin approves.
      shouldCreateUser: false,
    },
  });

  if (error) {
    // Log the reason; the reply below is identical either way.
    console.error("magic link failed:", error.message);
  }

  return {
    ok: true,
    error: undefined,
  };
}

/**
 * Email + password sign-in.
 *
 * Exists for the temporary password an administrator issues when setting up an
 * account. The allowlist is checked first so a password belonging to some
 * other account on the same Supabase project is never even tried, and the
 * failure message is identical for "wrong password", "no such user" and "not
 * staff" — three different truths, one reply.
 */
export async function signInWithPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!supabaseConfigured()) {
    return { error: "Sign-in is not configured." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  // Keyed on the address being tried, so the bucket has to be built after the
  // form is read rather than before it.
  const key = await throttleKey(email);
  if (throttled(key)) {
    return { error: "Too many attempts. Try again in a minute." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    recordFailure(key);
    return { error: "Those details are not correct." };
  }

  attempts.delete(key);
  // Where they land is decided downstream: a pending account goes to the
  // waiting screen, an account still on an issued password goes to change it,
  // and only an approved one reaches the dashboard.
  redirect("/admin");
}

/**
 * Create an account.
 *
 * Open to anyone, and that is safe by construction: the trigger writes the new
 * row as 'pending', and a pending account can read nothing. Approval is a
 * separate, human decision made by a super admin.
 */
export async function signUp(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!supabaseConfigured()) return { error: "Sign-up is not configured." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^\S+@\S+\.\S{2,}$/.test(email)) return { error: "Enter a valid email address." };
  if (!fullName) return { error: "Enter your name." };
  if (password.length < 12) return { error: "Use a password of at least 12 characters." };

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${protocol}://${host}/admin/auth/callback`,
      // Picked up by the trigger and written into the staff row.
      data: { full_name: fullName, [PASSWORD_CHANGED_AT]: new Date().toISOString() },
    },
  });

  if (error) {
    // "User already registered" is worth saying — it is the account holder in
    // front of us, and hiding it just produces a confused second attempt.
    return { error: error.message };
  }

  return { ok: true };
}

// ------------------------------------------------------------ user management

async function requireSuperAdmin() {
  const staff = await currentStaff();
  if (!staff || staff.status !== "approved") redirect("/admin/login");
  if (staff.role !== "super_admin") redirect("/admin");
  return staff;
}

/**
 * Approve, suspend, promote or demote another account.
 *
 * The database has the final say — RLS only permits these writes for an
 * approved super admin — but the checks here give a decent error instead of a
 * silent no-op, and stop a super admin removing their own access by accident.
 */
export async function updateStaffMember(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await requireSuperAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!id) return { error: "Missing account." };

  const patch: { status?: string; role?: string } = {};
  if (status && ["pending", "approved", "suspended"].includes(status)) patch.status = status;
  if (role && ["super_admin", "staff"].includes(role)) patch.role = role;
  if (Object.keys(patch).length === 0) return { error: "Nothing to change." };

  // Locking yourself out is a one-click mistake with no way back except SQL.
  if (id === me.id && (patch.role === "staff" || patch.status !== undefined)) {
    return { error: "You cannot change your own role or status." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("staff").update(patch).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { ok: true };
}

/**
 * Register someone who does not have an account yet.
 *
 * This is the "create an account" action. It records the address and the role
 * it should have; the person completes the signup form themselves and is
 * approved the moment they do. The alternative — minting the auth user here —
 * would mean this app holding a key that can read and rewrite every table,
 * and an administrator knowing a colleague's password.
 */
export async function inviteStaff(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await requireSuperAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "staff");

  if (!/^\S+@\S+\.\S{2,}$/.test(email)) return { error: "Enter a valid email address." };
  if (!["super_admin", "staff"].includes(role)) return { error: "Unknown role." };

  const supabase = await createSupabaseServerClient();

  // Someone who already has an account is managed on the list below, not
  // invited again — say so rather than writing an invite that never fires.
  const { data: existing } = await supabase
    .from("staff")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) return { error: "That address already has an account." };

  const { error } = await supabase
    .from("staff_invites")
    .upsert({ email, role, invited_by: me.id, accepted_at: null });

  if (error) {
    if (error.message.includes("staff_invites")) {
      return { error: "Run migration 0002_staff_invites.sql in Supabase first." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function revokeInvite(formData: FormData): Promise<void> {
  await requireSuperAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("staff_invites").delete().eq("email", email);

  revalidatePath("/admin/users");
}

/**
 * Replace the password and record that it happened.
 *
 * `password_changed_at` is what lifts the block. It is written in the same
 * call that sets the password, so the two cannot drift apart.
 */
export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const staff = await currentStaff();
  if (!staff) redirect("/admin/login");

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 12) {
    return { error: "Use at least 12 characters." };
  }
  if (password !== confirm) {
    return { error: "The two passwords do not match." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password,
    data: { [PASSWORD_CHANGED_AT]: new Date().toISOString() },
  });

  if (error) {
    // Supabase rejects a password identical to the current one, which is the
    // most likely failure here and worth saying plainly.
    return { error: error.message };
  }

  redirect("/admin");
}

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!passwordLoginAllowed()) {
    return { error: "Password sign-in is disabled. Use the email link." };
  }

  // No address to key on — this path is the single shared development
  // password — so the client's own IP is the whole bucket.
  const key = await throttleKey("password-fallback");
  if (throttled(key)) {
    return { error: "Too many attempts. Try again in a minute." };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter the dashboard password." };

  let valid: boolean;
  try {
    valid = checkPassword(password);
  } catch {
    // adminApiKey() throws when the deployment has no key configured.
    return { error: "The dashboard is not configured. Set ADMIN_API_KEY." };
  }

  if (!valid) {
    recordFailure(key);
    return { error: "That password is not correct." };
  }

  attempts.delete(key);
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ------------------------------------------------------------------ triage

type Kind = "applications" | "inquiries";

function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

export async function updateRecord(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const kind = String(formData.get("kind")) as Kind;
  const id = String(formData.get("id") ?? "");
  if (!id || (kind !== "applications" && kind !== "inquiries")) {
    return { error: "Missing record." };
  }

  const patch: { status?: string; note?: string } = {};
  const status = formData.get("status");
  if (typeof status === "string" && status) {
    if (!isStatus(status)) return { error: "Unknown status." };
    patch.status = status;
  }
  const note = formData.get("note");
  if (typeof note === "string") patch.note = note;

  if (Object.keys(patch).length === 0) return { ok: true };

  try {
    if (kind === "applications") await adminApi.patchApplication(id, patch);
    else await adminApi.patchInquiry(id, patch);
  } catch (error) {
    return {
      error:
        error instanceof ApiError
          ? `Could not save (${error.status}): ${error.message}`
          : "Could not reach the API.",
    };
  }

  revalidatePath(`/admin/${kind}`);
  revalidatePath(`/admin/${kind}/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}

// -------------------------------------------------------------------- blog

function parseSections(raw: string) {
  // The editor is a plain textarea: a line starting with "## " opens a headed
  // section, a blank line separates paragraphs. It maps exactly onto the
  // BlogSection shape the public pages already render.
  //
  // Parsed line by line rather than by splitting on blank lines, because a
  // heading written directly above its first paragraph — which is how anyone
  // actually types — would otherwise be read as one enormous heading.
  const sections: { heading?: string; body: string[] }[] = [];
  let current: { heading?: string; body: string[] } = { body: [] };
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) current.body.push(paragraph.join(" ").trim());
    paragraph = [];
  };

  const flushSection = () => {
    flushParagraph();
    if (current.heading || current.body.length) sections.push(current);
    current = { body: [] };
  };

  for (const line of raw.split(/\r?\n/)) {
    const text = line.trim();

    if (text.startsWith("## ")) {
      flushSection();
      current = { heading: text.slice(3).trim().slice(0, 200), body: [] };
    } else if (!text) {
      flushParagraph();
    } else {
      paragraph.push(text);
    }
  }
  flushSection();

  return sections;
}

export async function savePost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const slug = String(formData.get("slug") ?? "").trim();
  const original = String(formData.get("original_slug") ?? "").trim();
  const body = {
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    category: String(formData.get("category") ?? "News").trim(),
    author: String(formData.get("author") ?? "").trim(),
    read_time: String(formData.get("read_time") ?? "").trim(),
    hero_image: String(formData.get("hero_image") ?? "").trim() || null,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    sections: parseSections(String(formData.get("body") ?? "")),
    published: formData.get("published") === "on",
  };

  if (!body.title) return { error: "A post needs a title." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "The slug may use lowercase letters, numbers and hyphens only." };
  }

  try {
    if (original) {
      // The slug is the primary key, so it is fixed once a post exists —
      // changing it would break every link already published to that URL.
      await adminApi.patchPost(original, body);
    } else {
      await adminApi.createPost({ slug, ...body });
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { error: "A post with that slug already exists." };
    }
    return {
      error:
        error instanceof ApiError
          ? `Could not save (${error.status}): ${error.message}`
          : "Could not reach the API.",
    };
  }

  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${original || slug}`);
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireSession();
  const slug = String(formData.get("slug") ?? "");
  if (slug) await adminApi.deletePost(slug);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
