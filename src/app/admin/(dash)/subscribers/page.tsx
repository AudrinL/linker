import { adminApi, requireSession } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/format";
import { ApiDown, EmptyState, PageHeader, Panel } from "@/components/admin/Panel";

export default async function SubscribersPage() {
  await requireSession();

  let subscribers: Awaited<ReturnType<typeof adminApi.subscribers>> | null = null;
  let failure: string | undefined;
  try {
    subscribers = await adminApi.subscribers();
  } catch (error) {
    failure = error instanceof Error ? error.message : undefined;
  }

  if (!subscribers) {
    return (
      <>
        <PageHeader title="Subscribers" />
        <ApiDown detail={failure} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Subscribers"
        subtitle="Everyone who signed up for the newsletter."
        action={
          subscribers.length > 0 ? (
            <a
              href="/api/admin/subscribers"
              className="rounded-full border border-mist/20 px-4 py-2 text-xs transition-colors hover:border-gold hover:text-gold"
            >
              Export CSV
            </a>
          ) : null
        }
      />

      <Panel>
        {subscribers.length === 0 ? (
          <EmptyState>No one has subscribed yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-mist/10">
            {subscribers.map((subscriber) => (
              <li
                key={subscriber.email}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
              >
                <a
                  href={`mailto:${subscriber.email}`}
                  className="text-sm transition-colors hover:text-gold"
                >
                  {subscriber.email}
                </a>
                <div className="flex items-center gap-4">
                  {subscriber.source && (
                    <span className="text-xs text-muted">{subscriber.source}</span>
                  )}
                  <span className="text-xs text-muted">
                    {formatDate(subscriber.created_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <p className="mt-4 text-xs text-muted">
        {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}. Records
        expire automatically after 180 days of inactivity.
      </p>
    </>
  );
}
