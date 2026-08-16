"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { STATUSES, STATUS_LABELS } from "@/lib/admin/types";

/**
 * Status tabs and a search box, both held in the URL.
 *
 * Keeping filter state in the query string rather than component state means a
 * filtered queue is a link — staff can bookmark "new work applications" or
 * paste it to a colleague, and the server does the filtering.
 */
export default function Filters({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const activeStatus = params.get("status") ?? "";
  const [query, setQuery] = useState(params.get("q") ?? "");

  // Debounced so a search does not fire a request per keystroke.
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (query === current) return;

    const timer = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (query) next.set("q", query);
      else next.delete("q");
      startTransition(() => router.replace(`?${next}`, { scroll: false }));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, params, router]);

  const setStatus = (status: string) => {
    const next = new URLSearchParams(params);
    if (status) next.set("status", status);
    else next.delete("status");
    startTransition(() => router.replace(`?${next}`, { scroll: false }));
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-1.5">
        {[["", "All"], ...STATUSES.map((s) => [s, STATUS_LABELS[s]])].map(
          ([value, label]) => (
            <button
              key={value || "all"}
              type="button"
              onClick={() => setStatus(value)}
              aria-pressed={activeStatus === value}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs transition-colors duration-300",
                activeStatus === value
                  ? "bg-bone text-white"
                  : "bg-ink text-mist hover:text-bone",
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <div className="relative ml-auto">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-56 rounded-full border border-mist/20 bg-ink px-4 py-2 text-xs outline-none transition-colors focus:border-gold"
        />
        {pending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.65rem] text-muted">
            …
          </span>
        )}
      </div>
    </div>
  );
}
