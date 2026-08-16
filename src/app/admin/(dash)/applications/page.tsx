import Link from "next/link";
import { Suspense } from "react";
import { API_BASE_URL, adminApi, requireSession } from "@/lib/admin/api";
import { SERVICE_LABELS, type Service } from "@/lib/admin/types";
import { relativeTime } from "@/lib/admin/format";
import { ApiDown, EmptyState, PageHeader, Panel } from "@/components/admin/Panel";
import Filters from "@/components/admin/Filters";
import StatusPill from "@/components/admin/StatusPill";

type SearchParams = Promise<{ status?: string; q?: string; service?: string }>;

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireSession();
  const { status, q, service } = await searchParams;

  // Filtering happens in the API so the same query works however the list
  // grows — the page never holds more rows than it shows.
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (service) params.set("service", service);

  let applications: Awaited<ReturnType<typeof adminApi.applications>> | null = null;
  let failure: string | undefined;
  try {
    applications = await adminApi.applications(params);
  } catch (error) {
    failure = error instanceof Error ? error.message : undefined;
  }

  if (!applications) {
    return (
      <>
        <PageHeader title="Applications" />
        <ApiDown baseUrl={API_BASE_URL} detail={failure} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Submissions from the work, study, visa and flight funnels."
      />

      <Suspense fallback={<div className="mb-4 h-9" />}>
        <Filters placeholder="Name, email, reference…" />
      </Suspense>

      <Panel>
        {applications.length === 0 ? (
          <EmptyState>
            {status || q
              ? "No applications match that filter."
              : "No applications yet."}
          </EmptyState>
        ) : (
          <ul className="divide-y divide-mist/10">
            {applications.map((application) => (
              <li key={application.id}>
                <Link
                  href={`/admin/applications/${application.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-abyss"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{application.name}</p>
                    <p className="truncate text-xs text-muted">
                      {application.email}
                      {application.destination ? ` · ${application.destination}` : ""}
                    </p>
                  </div>

                  <span className="font-mono text-[0.7rem] text-muted">
                    {application.reference}
                  </span>
                  <span className="w-28 text-xs text-mist">
                    {SERVICE_LABELS[application.service as Service] ??
                      application.service}
                  </span>
                  <StatusPill status={application.status} />
                  <span className="w-24 text-right text-xs text-muted">
                    {relativeTime(application.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <p className="mt-4 text-xs text-muted">
        Showing {applications.length} application
        {applications.length === 1 ? "" : "s"}.
      </p>
    </>
  );
}
