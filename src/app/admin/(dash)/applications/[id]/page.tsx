import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, adminApi, requireSession } from "@/lib/admin/api";
import { SERVICE_LABELS, type Service } from "@/lib/admin/types";
import {
  formatBytes,
  formatDateTime,
  humanizeKey,
  relativeTime,
} from "@/lib/admin/format";
import { Panel } from "@/components/admin/Panel";
import StatusPill from "@/components/admin/StatusPill";
import TriageForm from "@/components/admin/TriageForm";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-mist/10 px-5 py-3 last:border-0 sm:grid-cols-[13rem_1fr] sm:gap-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-sm break-words">{children}</dd>
    </div>
  );
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;

  let application;
  try {
    application = await adminApi.application(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  // The applicant's own phone number, cleaned to the digits wa.me expects, so
  // staff can pick up the conversation where the funnel left it.
  const digits = application.phone?.replace(/\D/g, "");

  return (
    <>
      <Link
        href="/admin/applications"
        className="mb-5 inline-block text-xs text-muted transition-colors hover:text-bone"
      >
        ← All applications
      </Link>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl tracking-tight">{application.name}</h1>
            <StatusPill status={application.status} />
          </div>
          <p className="mt-1.5 text-sm text-muted">
            <span className="font-mono">{application.reference}</span> ·{" "}
            {SERVICE_LABELS[application.service as Service] ?? application.service} ·
            received {relativeTime(application.created_at)}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={`mailto:${application.email}`}
            className="rounded-full border border-mist/20 px-4 py-2 text-xs transition-colors hover:border-gold hover:text-gold"
          >
            Email
          </a>
          {digits && (
            <a
              href={whatsappLink(
                digits,
                `Hello ${application.name}, this is ${site.shortName} about your application ${application.reference}.`,
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
          <Panel>
            <h2 className="border-b border-mist/12 px-5 py-3.5 text-xs font-medium text-mist">
              Applicant
            </h2>
            <dl>
              <Row label="Email">
                <a href={`mailto:${application.email}`} className="hover:text-gold">
                  {application.email}
                </a>
              </Row>
              {application.phone && <Row label="Phone">{application.phone}</Row>}
              {application.destination && (
                <Row label="Destination">{application.destination}</Row>
              )}
              <Row label="Form">{application.form_id}</Row>
              <Row label="Submitted">{formatDateTime(application.created_at)}</Row>
            </dl>
          </Panel>

          {Object.keys(application.values).length > 0 && (
            <Panel>
              <h2 className="border-b border-mist/12 px-5 py-3.5 text-xs font-medium text-mist">
                Answers
              </h2>
              <dl>
                {Object.entries(application.values).map(([key, value]) => (
                  <Row key={key} label={humanizeKey(key)}>
                    {value || <span className="text-muted">—</span>}
                  </Row>
                ))}
              </dl>
            </Panel>
          )}

          <Panel>
            <h2 className="border-b border-mist/12 px-5 py-3.5 text-xs font-medium text-mist">
              Documents
            </h2>
            {application.documents.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted">
                No documents were attached.
              </p>
            ) : (
              <>
                <ul className="divide-y divide-mist/10">
                  {application.documents.map((document) => (
                    <li
                      key={document.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                    >
                      <span className="text-sm">{document.label}</span>
                      <span className="text-xs text-muted">
                        {document.filename ?? "declared"}
                        {document.size_bytes
                          ? ` · ${formatBytes(document.size_bytes)}`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-mist/10 px-5 py-3 text-[0.7rem] text-muted">
                  Filenames only — the files themselves still arrive over
                  WhatsApp or email until document upload is built.
                </p>
              </>
            )}
          </Panel>

          {application.consents.length > 0 && (
            <Panel>
              <h2 className="border-b border-mist/12 px-5 py-3.5 text-xs font-medium text-mist">
                Declarations accepted
              </h2>
              <ul className="space-y-2 px-5 py-4">
                {application.consents.map((consent, index) => (
                  <li key={index} className="flex gap-2.5 text-sm text-mist">
                    <span aria-hidden className="text-verdant">
                      ✓
                    </span>
                    {consent}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        <Panel className="p-5 lg:sticky lg:top-8">
          <h2 className="mb-4 text-xs font-medium text-mist">Triage</h2>
          <TriageForm
            kind="applications"
            id={application.id}
            status={application.status}
            note={application.note}
          />
          <p className="mt-4 border-t border-mist/10 pt-3 text-[0.7rem] text-muted">
            Last updated {formatDateTime(application.updated_at)}
          </p>
        </Panel>
      </div>
    </>
  );
}
