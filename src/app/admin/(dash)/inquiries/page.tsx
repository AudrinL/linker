import Link from "next/link";
import { Suspense } from "react";
import { adminApi, requireSession } from "@/lib/admin/api";
import { SERVICE_LABELS, type Service } from "@/lib/admin/types";
import { relativeTime } from "@/lib/admin/format";
import { ApiDown, EmptyState, PageHeader, Panel } from "@/components/admin/Panel";
import Filters from "@/components/admin/Filters";
import StatusPill from "@/components/admin/StatusPill";

type SearchParams = Promise<{ status?: string; q?: string; service?: string }>;

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireSession();
  const { status, q, service } = await searchParams;

  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (service) params.set("service", service);

  let inquiries: Awaited<ReturnType<typeof adminApi.inquiries>> | null = null;
  let failure: string | undefined;
  try {
    inquiries = await adminApi.inquiries(params);
  } catch (error) {
    failure = error instanceof Error ? error.message : undefined;
  }

  if (!inquiries) {
    return (
      <>
        <PageHeader title="Inquiries" />
        <ApiDown detail={failure} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Inquiries"
        subtitle="Messages from the contact form and service pages."
      />

      <Suspense fallback={<div className="mb-4 h-9" />}>
        <Filters placeholder="Name, email, message…" />
      </Suspense>

      <Panel>
        {inquiries.length === 0 ? (
          <EmptyState>
            {status || q ? "No inquiries match that filter." : "No inquiries yet."}
          </EmptyState>
        ) : (
          <ul className="divide-y divide-mist/10">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id}>
                <Link
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-abyss"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{inquiry.name}</p>
                      <p className="truncate text-xs text-muted">{inquiry.email}</p>
                    </div>
                    <span className="w-28 text-xs text-mist">
                      {SERVICE_LABELS[inquiry.service as Service] ?? inquiry.service}
                    </span>
                    <StatusPill status={inquiry.status} />
                    <span className="w-24 text-right text-xs text-muted">
                      {relativeTime(inquiry.created_at)}
                    </span>
                  </div>
                  {/* One line of the message: enough to triage without opening. */}
                  <p className="mt-1.5 line-clamp-1 text-xs text-mist">
                    {inquiry.message}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <p className="mt-4 text-xs text-muted">
        Showing {inquiries.length} inquir{inquiries.length === 1 ? "y" : "ies"}.
      </p>
    </>
  );
}
