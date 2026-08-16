/**
 * Server-side client for the FastAPI backend.
 *
 * Every call here runs on the server and carries the admin bearer token, so
 * this module must never be imported from a Client Component — the key would
 * be bundled into the browser. Client components get data as props, and mutate
 * through the Server Actions in `src/app/admin/actions.ts`.
 */

import { redirect } from "next/navigation";
import { adminApiKey, hasSession } from "./session";
import type {
  Application,
  BlogPost,
  Inquiry,
  Stats,
  Subscriber,
} from "./types";

export const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:8000";

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

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${adminApiKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    // The dashboard is a live inbox: a cached list would show staff stale work.
    cache: "no-store",
  });

  if (!response.ok) {
    // Surface the backend's `detail` when it sent one, but never the body of a
    // 500 — that can carry internals we do not want on a staff screen.
    let detail = response.statusText;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") {
        detail = body.detail;
      } else if (Array.isArray(body?.detail)) {
        // FastAPI's 422 detail is a list of per-field errors. Flattened to
        // "field: message" so the dashboard says which box is wrong rather
        // than the useless bare "Unprocessable Entity".
        detail = body.detail
          .map((issue: { loc?: unknown[]; msg?: string }) => {
            const field = (issue.loc ?? []).filter((p) => p !== "body").join(".");
            return field ? `${field}: ${issue.msg}` : issue.msg;
          })
          .join("; ");
      }
    } catch {
      /* non-JSON error body — the status line is enough */
    }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

const json = (body: unknown) => JSON.stringify(body);

export const adminApi = {
  stats: () => call<Stats>("/admin/stats"),

  applications: (params: URLSearchParams = new URLSearchParams()) =>
    call<Application[]>(`/admin/applications?${params}`),
  application: (id: string) => call<Application>(`/admin/applications/${id}`),
  patchApplication: (id: string, patch: { status?: string; note?: string }) =>
    call<Application>(`/admin/applications/${id}`, {
      method: "PATCH",
      body: json(patch),
    }),

  inquiries: (params: URLSearchParams = new URLSearchParams()) =>
    call<Inquiry[]>(`/admin/inquiries?${params}`),
  inquiry: (id: string) => call<Inquiry>(`/admin/inquiries/${id}`),
  patchInquiry: (id: string, patch: { status?: string; note?: string }) =>
    call<Inquiry>(`/admin/inquiries/${id}`, {
      method: "PATCH",
      body: json(patch),
    }),

  subscribers: () => call<Subscriber[]>("/admin/subscribers"),

  posts: () => call<BlogPost[]>("/admin/blog"),
  post: (slug: string) => call<BlogPost>(`/admin/blog/${slug}`),
  createPost: (post: unknown) =>
    call<BlogPost>("/admin/blog", { method: "POST", body: json(post) }),
  patchPost: (slug: string, patch: unknown) =>
    call<BlogPost>(`/admin/blog/${slug}`, { method: "PATCH", body: json(patch) }),
  deletePost: (slug: string) =>
    call<void>(`/admin/blog/${slug}`, { method: "DELETE" }),
};

/** Is the backend reachable at all? Used by the dashboard's empty states. */
export async function apiReachable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}
