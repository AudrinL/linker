"use client";

/**
 * Supabase client for Client Components.
 *
 * `createBrowserClient` is a singleton internally, so calling this repeatedly
 * is free. The publishable key is public by design — it carries no privilege
 * beyond what row-level security allows.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
