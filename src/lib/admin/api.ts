/**
 * The dashboard's data layer, backed by Supabase.
 *
 * This replaced a FastAPI service on AWS Lambda. The method names and return
 * types are deliberately unchanged from that client so the pages and Server
 * Actions above it did not have to move — what changed is underneath: instead
 * of a bearer token granting blanket access to every record, each query runs as
 * the signed-in member of staff and row-level security decides what they may
 * see. An unauthenticated caller reaching this code gets nothing back, rather
 * than everything.
 *
 * Every call runs on the server. Nothing here may be imported from a Client
 * Component: components receive data as props and mutate through the Server
 * Actions in `src/app/admin/actions.ts`.
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSession } from "./session";
import type {
  Application,
  BlogPost,
  DocumentRef,
  Inquiry,
  Stats,
  Subscriber,
} from "./types";

/** How far back the overview sparkline reaches. Matches the old API. */
const TREND_DAYS = 14;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Gate every page and action. Redirects rather than throwing so an expired
 * session lands on the login screen instead of an error boundary.
 */
export async function requireSession(): Promise<void> {
  if (!(await hasSession())) redirect("/admin/login");
}

/**
 * Turn a PostgREST error into the ApiError the dashboard already renders.
 *
 * An RLS refusal arrives as an ordinary empty result rather than an error, so
 * the common "not allowed" case surfaces as an empty list — which is the right
 * thing for a staff member whose account was suspended mid-session.
 */
function fail(message: string | undefined, status = 500): never {
  throw new ApiError(status, message || "The database rejected that request.");
}

// ------------------------------------------------------------------- mapping

type Row = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const nullableStr = (v: unknown): string | null =>
  typeof v === "string" ? v : null;

function toApplication(row: Row): Application {
  return {
    id: str(row.id),
    form_id: str(row.form_id),
    service: str(row.service) as Application["service"],
    reference: str(row.reference),
    name: str(row.name),
    email: str(row.email),
    phone: nullableStr(row.phone),
    destination: nullableStr(row.destination),
    // `answers` in the database — `values` is a reserved word in SQL. The
    // dashboard has always called it `values`, so the rename stops here.
    values: (row.answers ?? {}) as Record<string, string>,
    documents: (row.documents ?? []) as DocumentRef[],
    consents: (row.consents ?? []) as string[],
    status: str(row.status) as Application["status"],
    note: nullableStr(row.note),
    created_at: str(row.created_at),
    updated_at: str(row.updated_at),
  };
}

function toInquiry(row: Row): Inquiry {
  return {
    id: str(row.id),
    name: str(row.name),
    email: str(row.email),
    phone: nullableStr(row.phone),
    service: str(row.service) as Inquiry["service"],
    message: str(row.message),
    source: nullableStr(row.source),
    status: str(row.status) as Inquiry["status"],
    note: nullableStr(row.note),
    created_at: str(row.created_at),
    updated_at: str(row.updated_at),
  };
}

function toPost(row: Row): BlogPost {
  return {
    slug: str(row.slug),
    title: str(row.title),
    excerpt: str(row.excerpt),
    category: str(row.category),
    author: str(row.author),
    read_time: str(row.read_time),
    hero_image: nullableStr(row.hero_image),
    tags: (row.tags ?? []) as string[],
    sections: (row.sections ?? []) as BlogPost["sections"],
    published: Boolean(row.published),
    published_at: nullableStr(row.published_at),
    created_at: str(row.created_at),
    updated_at: str(row.updated_at),
  };
}

function toSubscriber(row: Row): Subscriber {
  return {
    email: str(row.email),
    source: nullableStr(row.source),
    created_at: str(row.created_at),
    unsubscribed: Boolean(row.unsubscribed),
  };
}

/**
 * Make a search term safe for PostgREST's `or` filter.
 *
 * That filter is a comma-separated list parsed from the query string, so a
 * comma, parenthesis or quote inside the term does not escape — it changes the
 * shape of the filter. Stripping them is enough here because the field is a
 * free-text search box, not a query language: no legitimate search needs them,
 * and `%` would otherwise let a visitor turn one search into a full scan.
 */
function safeSearch(term: string): string {
  return term.replace(/[,()"'%\\]/g, " ").trim().slice(0, 100);
}

// -------------------------------------------------------------------- queries

async function db() {
  return createSupabaseServerClient();
}

export const adminApi = {
  /**
   * Overview counters.
   *
   * Computed here rather than in SQL for the same reason the old service did it
   * in Python: at this volume one small read beats maintaining the aggregates,
   * and it keeps the numbers obviously consistent with the lists beside them.
   * Only the columns the counters need are selected.
   */
  stats: async (): Promise<Stats> => {
    const supabase = await db();

    const [applications, inquiries, posts, subscribers] = await Promise.all([
      supabase.from("applications").select("service, status, created_at"),
      supabase.from("inquiries").select("service, status, created_at"),
      supabase.from("posts").select("published"),
      supabase.from("subscribers").select("email"),
    ]);

    const firstError =
      applications.error ?? inquiries.error ?? posts.error ?? subscribers.error;
    if (firstError) fail(firstError.message);

    const apps = applications.data ?? [];
    const inqs = inquiries.data ?? [];
    const allPosts = posts.data ?? [];

    const by_service: Record<string, number> = {};
    const by_status: Record<string, number> = {};
    for (const item of [...apps, ...inqs]) {
      const service = str(item.service);
      const status = str(item.status);
      by_service[service] = (by_service[service] ?? 0) + 1;
      by_status[status] = (by_status[status] ?? 0) + 1;
    }

    // A fixed window of days, zero-filled, so the sparkline keeps its shape on
    // a quiet week instead of collapsing to the days that happened to have
    // traffic.
    const recent_days: Record<string, number> = {};
    const start = new Date();
    start.setUTCDate(start.getUTCDate() - (TREND_DAYS - 1));
    for (let n = 0; n < TREND_DAYS; n += 1) {
      const day = new Date(start);
      day.setUTCDate(start.getUTCDate() + n);
      recent_days[day.toISOString().slice(0, 10)] = 0;
    }
    for (const item of [...apps, ...inqs]) {
      const key = str(item.created_at).slice(0, 10);
      if (key in recent_days) recent_days[key] += 1;
    }

    return {
      applications_total: apps.length,
      applications_new: apps.filter((a) => a.status === "new").length,
      inquiries_total: inqs.length,
      inquiries_new: inqs.filter((i) => i.status === "new").length,
      subscribers_total: (subscribers.data ?? []).length,
      posts_total: allPosts.length,
      posts_published: allPosts.filter((p) => p.published).length,
      by_service,
      by_status,
      recent_days,
    };
  },

  applications: async (
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<Application[]> => {
    const supabase = await db();
    let query = supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    const status = params.get("status");
    const service = params.get("service");
    const q = params.get("q");
    if (status) query = query.eq("status", status);
    if (service) query = query.eq("service", service);
    if (q) {
      const term = safeSearch(q);
      if (term) {
        query = query.or(
          [
            `name.ilike.%${term}%`,
            `email.ilike.%${term}%`,
            `reference.ilike.%${term}%`,
            `destination.ilike.%${term}%`,
            `form_id.ilike.%${term}%`,
          ].join(","),
        );
      }
    }

    const { data, error } = await query;
    if (error) fail(error.message);
    return (data ?? []).map(toApplication);
  },

  application: async (id: string): Promise<Application> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) fail(error.message);
    if (!data) fail("Application not found", 404);
    return toApplication(data);
  },

  patchApplication: async (
    id: string,
    patch: { status?: string; note?: string },
  ): Promise<Application> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("applications")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) fail(error.message);
    // No row came back: either it is gone, or this account is not allowed to
    // change it. Both are a 404 here — saying which would tell a suspended
    // account that the record exists.
    if (!data) fail("Application not found", 404);
    return toApplication(data);
  },

  inquiries: async (
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<Inquiry[]> => {
    const supabase = await db();
    let query = supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    const status = params.get("status");
    const service = params.get("service");
    const q = params.get("q");
    if (status) query = query.eq("status", status);
    if (service) query = query.eq("service", service);
    if (q) {
      const term = safeSearch(q);
      if (term) {
        query = query.or(
          [
            `name.ilike.%${term}%`,
            `email.ilike.%${term}%`,
            `message.ilike.%${term}%`,
          ].join(","),
        );
      }
    }

    const { data, error } = await query;
    if (error) fail(error.message);
    return (data ?? []).map(toInquiry);
  },

  inquiry: async (id: string): Promise<Inquiry> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) fail(error.message);
    if (!data) fail("Inquiry not found", 404);
    return toInquiry(data);
  },

  patchInquiry: async (
    id: string,
    patch: { status?: string; note?: string },
  ): Promise<Inquiry> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("inquiries")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) fail(error.message);
    if (!data) fail("Inquiry not found", 404);
    return toInquiry(data);
  },

  subscribers: async (): Promise<Subscriber[]> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) fail(error.message);
    return (data ?? []).map(toSubscriber);
  },

  /** Drafts included — this is the CMS view. */
  posts: async (): Promise<BlogPost[]> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) fail(error.message);
    return (data ?? []).map(toPost);
  },

  post: async (slug: string): Promise<BlogPost> => {
    const supabase = await db();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) fail(error.message);
    if (!data) fail("Post not found", 404);
    return toPost(data);
  },

  createPost: async (post: unknown): Promise<BlogPost> => {
    const supabase = await db();
    const payload = { ...(post as Record<string, unknown>) };
    // Publishing without an explicit date stamps it now, so the public list
    // never sorts a live post to the bottom on a null.
    if (payload.published && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("posts")
      .insert(payload)
      .select()
      .maybeSingle();
    if (error) {
      // 23505 is unique_violation — the slug is the primary key.
      if (error.code === "23505") {
        fail("A post with that slug already exists", 409);
      }
      fail(error.message);
    }
    if (!data) fail("The post could not be created.");
    return toPost(data);
  },

  patchPost: async (slug: string, patch: unknown): Promise<BlogPost> => {
    const supabase = await db();
    const payload = { ...(patch as Record<string, unknown>) };
    if (payload.published && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("posts")
      .update(payload)
      .eq("slug", slug)
      .select()
      .maybeSingle();
    if (error) fail(error.message);
    if (!data) fail("Post not found", 404);
    return toPost(data);
  },

  deletePost: async (slug: string): Promise<void> => {
    const supabase = await db();
    const { error } = await supabase.from("posts").delete().eq("slug", slug);
    if (error) fail(error.message);
  },
};

/**
 * Is the data layer reachable at all? Used by the dashboard's empty states.
 *
 * `head: true` asks for the count and no rows, so this stays cheap enough to
 * call on a page that is already about to fail.
 */
export async function apiReachable(): Promise<boolean> {
  try {
    const supabase = await db();
    const { error } = await supabase
      .from("posts")
      .select("slug", { count: "exact", head: true });
    return !error;
  } catch {
    return false;
  }
}
