import { cn } from "@/lib/utils";

/** The one surface every dashboard section sits on. */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-md)] border border-mist/12 bg-ink",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-6 py-16 text-center text-sm text-muted">{children}</p>
  );
}

/**
 * Shown whenever a page cannot reach the API. Says which URL failed, because
 * the usual cause is `API_BASE_URL` pointing somewhere that is not running.
 */
export function ApiDown({ baseUrl, detail }: { baseUrl: string; detail?: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-ember/25 bg-ember/[0.05] p-6">
      <h2 className="text-sm font-medium text-ember">The API is not responding</h2>
      <p className="mt-2 text-sm text-mist">
        Nothing could be loaded from <code className="font-mono text-xs">{baseUrl}</code>
        {detail ? ` — ${detail}` : "."}
      </p>
      <p className="mt-3 text-xs text-muted">
        Check that the backend is running and that <code>API_BASE_URL</code> and{" "}
        <code>ADMIN_API_KEY</code> are set for this environment.
      </p>
    </div>
  );
}
