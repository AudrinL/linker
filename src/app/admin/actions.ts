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
 * Crude per-instance throttle on failed logins. Netlify runs several instances
 * so this is not a hard limit — API Gateway's throttling is the real backstop.
 * It exists to make an online guessing attempt slow enough to be pointless.
 */
const attempts = new Map<string, { count: number; until: number }>();
const LOCKOUT_MS = 60_000;
const MAX_ATTEMPTS = 5;

function throttleKey() {
  // One shared login, so the bucket is global rather than per-identity.
  return "admin";
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

  const key = throttleKey();
  const record = attempts.get(key);
  if (record && record.count >= MAX_ATTEMPTS && Date.now() < record.until) {
    return { error: "Too many attempts. Try again in a minute." };
  }
  attempts.set(key, {
    count: (record && Date.now() < record.until ? record.count : 0) + 1,
    until: Date.now() + LOCKOUT_MS,
  });

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

  const key = throttleKey();
  const record = attempts.get(key);
  if (record && record.count >= MAX_ATTEMPTS && Date.now() < record.until) {
    return { error: "Too many attempts. Try again in a minute." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const failed = () => {
    attempts.set(key, {
      count: (record && Date.now() < record.until ? record.count : 0) + 1,
      until: Date.now() + LOCKOUT_MS,
    });
    return { error: "Those details are not correct." };
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return failed();

  attempts.delete(key);
  // Where they land is decided by the dashboard layout: an account still on
  // its issued password is sent to change it before it sees anything.
  redirect("/admin");
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

  const key = throttleKey();
  const record = attempts.get(key);
  if (record && record.count >= MAX_ATTEMPTS && Date.now() < record.until) {
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
    const next = record && Date.now() < record.until ? record.count + 1 : 1;
    attempts.set(key, { count: next, until: Date.now() + LOCKOUT_MS });
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
