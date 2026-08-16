import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, adminApi, requireSession } from "@/lib/admin/api";
import { SERVICE_LABELS, type Service } from "@/lib/admin/types";
import { formatDateTime, relativeTime } from "@/lib/admin/format";
import { Panel } from "@/components/admin/Panel";
import StatusPill from "@/components/admin/StatusPill";
import TriageForm from "@/components/admin/TriageForm";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export default async function InquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;

  let inquiry;
  try {
    inquiry = await adminApi.inquiry(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const digits = inquiry.phone?.replace(/\D/g, "");

  return (
    <>
      <Link
        href="/admin/inquiries"
        className="mb-5 inline-block text-xs text-muted transition-colors hover:text-bone"
      >
        ← All inquiries
      </Link>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl tracking-tight">{inquiry.name}</h1>
            <StatusPill status={inquiry.status} />
          </div>
          <p className="mt-1.5 text-sm text-muted">
            {SERVICE_LABELS[inquiry.service as Service] ?? inquiry.service} · received{" "}
            {relativeTime(inquiry.created_at)}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
              `${site.shortName} — your inquiry`,
            )}`}
            className="rounded-full border border-mist/20 px-4 py-2 text-xs transition-colors hover:border-gold hover:text-gold"
          >
            Reply by email
          </a>
          {digits && (
            <a
              href={whatsappLink(
                digits,
                `Hello ${inquiry.name}, this is ${site.shortName} replying to your message.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-mist/20 px-4 py-2 text-xs transition-colors hover:border-gold hover:text-gold"
            >
              WhatsApp
            </a>
          )}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-4">
          <Panel className="p-5">
            <h2 className="mb-3 text-xs font-medium text-mist">Message</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </Panel>

          <Panel>
            <h2 className="border-b border-mist/12 px-5 py-3.5 text-xs font-medium text-mist">
              Contact
            </h2>
            <dl className="px-5 py-1">
              <div className="grid gap-1 border-b border-mist/10 py-3 sm:grid-cols-[10rem_1fr]">
                <dt className="text-xs text-muted">Email</dt>
                <dd className="text-sm">
                  <a href={`mailto:${inquiry.email}`} className="hover:text-gold">
                    {inquiry.email}
                  </a>
                </dd>
              </div>
              {inquiry.phone && (
                <div className="grid gap-1 border-b border-mist/10 py-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-xs text-muted">Phone</dt>
                  <dd className="text-sm">{inquiry.phone}</dd>
                </div>
              )}
              {inquiry.source && (
                <div className="grid gap-1 border-b border-mist/10 py-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-xs text-muted">Sent from</dt>
                  <dd className="text-sm">{inquiry.source}</dd>
                </div>
              )}
              <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                <dt className="text-xs text-muted">Received</dt>
                <dd className="text-sm">{formatDateTime(inquiry.created_at)}</dd>
              </div>
            </dl>
          </Panel>
        </div>

        <Panel className="p-5 lg:sticky lg:top-8">
          <h2 className="mb-4 text-xs font-medium text-mist">Triage</h2>
          <TriageForm
            kind="inquiries"
            id={inquiry.id}
            status={inquiry.status}
            note={inquiry.note}
          />
          <p className="mt-4 border-t border-mist/10 pt-3 text-[0.7rem] text-muted">
            Last updated {formatDateTime(inquiry.updated_at)}
          </p>
        </Panel>
      </div>
    </>
  );
}
