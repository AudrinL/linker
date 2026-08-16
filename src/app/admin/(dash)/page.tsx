import Link from "next/link";
import { adminApi, requireSession } from "@/lib/admin/api";
import { SERVICE_LABELS, type Service } from "@/lib/admin/types";
import type { Application, Inquiry, Stats } from "@/lib/admin/types";
import { relativeTime } from "@/lib/admin/format";
import { ApiDown, EmptyState, PageHeader, Panel } from "@/components/admin/Panel";
import StatusPill from "@/components/admin/StatusPill";
import TrendBars from "@/components/admin/TrendBars";

function Stat({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: number;
  hint?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[var(--radius-md)] border border-mist/12 bg-ink p-5 transition-colors duration-300 hover:border-gold/40"
    >
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-gold">{hint}</p>}
    </Link>
  );
}

export default async function OverviewPage() {
  await requireSession();

  // Data first, JSX after: constructing elements inside the try would put them
  // outside the catch's reach anyway, since React renders them later.
  let data: { stats: Stats; applications: Application[]; inquiries: Inquiry[] } | null =
    null;
  let failure: string | undefined;

  try {
    const [stats, applications, inquiries] = await Promise.all([
      adminApi.stats(),
      adminApi.applications(),
      adminApi.inquiries(),
    ]);
    data = { stats, applications, inquiries };
  } catch (error) {
    failure = error instanceof Error ? error.message : undefined;
  }

  if (!data) {
    return (
      <>
        <PageHeader title="Overview" />
        <ApiDown detail={failure} />
      </>
    );
  }

  const { stats, applications, inquiries } = data;

  // One combined "what came in" feed — staff think in arrival order, not in
  // which form an applicant happened to use.
  const feed = [
    ...applications.map((a) => ({
      key: `a-${a.id}`,
      href: `/admin/applications/${a.id}`,
      title: a.name,
      meta: `${a.reference} · ${SERVICE_LABELS[a.service as Service] ?? a.service}`,
      status: a.status,
      at: a.created_at,
    })),
    ...inquiries.map((i) => ({
      key: `i-${i.id}`,
      href: `/admin/inquiries/${i.id}`,
      title: i.name,
      meta: `Inquiry · ${SERVICE_LABELS[i.service as Service] ?? i.service}`,
      status: i.status,
      at: i.created_at,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Everything that has come in through the website."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Applications"
          value={stats.applications_total}
          hint={stats.applications_new ? `${stats.applications_new} new` : undefined}
          href="/admin/applications"
        />
        <Stat
          label="Inquiries"
          value={stats.inquiries_total}
          hint={stats.inquiries_new ? `${stats.inquiries_new} new` : undefined}
          href="/admin/inquiries"
        />
        <Stat
          label="Subscribers"
          value={stats.subscribers_total}
          href="/admin/subscribers"
        />
        <Stat
          label="Journal posts"
          value={stats.posts_total}
          hint={`${stats.posts_published} live`}
          href="/admin/blog"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="p-6">
          <TrendBars days={stats.recent_days} />
        </Panel>

        <Panel className="p-6">
          <h2 className="mb-4 text-xs font-medium text-mist">By service</h2>
          {Object.keys(stats.by_service).length === 0 ? (
            <p className="text-sm text-muted">Nothing yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {Object.entries(stats.by_service)
                .sort(([, a], [, b]) => b - a)
                .map(([service, count]) => (
                  <li key={service} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-bone">
                      {SERVICE_LABELS[service as Service] ?? service}
                    </span>
                    <span className="text-sm tabular-nums text-muted">{count}</span>
                  </li>
                ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel className="mt-4">
        <h2 className="border-b border-mist/12 px-6 py-4 text-xs font-medium text-mist">
          Latest arrivals
        </h2>
        {feed.length === 0 ? (
          <EmptyState>
            No submissions yet. They appear here the moment a form is sent.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-mist/10">
            {feed.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-6 py-3.5 transition-colors hover:bg-abyss"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted">{item.meta}</span>
                  <StatusPill status={item.status} />
                  <span className="w-24 text-right text-xs text-muted">
                    {relativeTime(item.at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
