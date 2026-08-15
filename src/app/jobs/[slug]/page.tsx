import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { jobs, getJob, relatedJobs } from "@/lib/jobs";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Checklist } from "@/components/ui/FeatureList";
import { Notice } from "@/components/ui/Notice";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} — ${job.country}`,
    description: job.summary,
  };
}

export default async function JobDetailPage({ params }: Params) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const related = relatedJobs(slug);
  const applyHref = `/work-abroad/apply?country=${encodeURIComponent(job.country)}&role=${encodeURIComponent(job.title)}`;

  const facts = [
    { label: "Country", value: `${job.flag} ${job.country}` },
    { label: "Sector", value: job.sector },
    { label: "Employment", value: job.employment },
    { label: "Experience", value: job.experience },
    ...(job.language ? [{ label: "Language", value: job.language }] : []),
    { label: "Skill level", value: job.skill },
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow={`${job.flag} ${job.country}`}
        title={job.title}
        subtitle={job.summary}
      />

      <main className="shell space-y-20 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-14">
            <section>
              <SectionHeading eyebrow="The role" title="What you would be doing" />
              <Checklist items={job.responsibilities} columns={1} className="mt-8" />
            </section>

            <section>
              <SectionHeading eyebrow="Requirements" title="What you need" />
              <Checklist items={job.requirements} columns={1} className="mt-8" />
            </section>
          </div>

          {/* Sticky summary — the facts a candidate screens on */}
          <aside className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7 lg:sticky lg:top-28">
            <p className="eyebrow">Salary</p>
            <p className="mt-2 font-display text-2xl tracking-tight text-gold">
              {job.salary}
            </p>

            <dl className="mt-7 space-y-4 border-t border-mist/12 pt-6">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.65rem] uppercase tracking-[0.15em] text-mist">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-[0.95rem] text-bone">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={applyHref}
                className="rounded-full bg-gold px-6 py-3.5 text-center text-sm font-medium text-white transition-colors duration-500 hover:bg-bone"
              >
                Apply now
              </Link>
              <Link
                href="/jobs"
                className="rounded-full border border-mist/25 px-6 py-3.5 text-center text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
              >
                View all jobs
              </Link>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted">
              Applying takes about ten minutes. Your country and role are filled
              in for you.
            </p>
          </aside>
        </div>

        {related.length > 0 && (
          <section>
            <SectionHeading eyebrow="Similar roles" title="You might also consider" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/jobs/${r.slug}`}
                  className="group flex flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/[0.04]"
                >
                  <span aria-hidden className="text-2xl leading-none">
                    {r.icon}
                  </span>
                  <h3 className="mt-4 font-display text-lg tracking-tight text-bone">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-mist">
                    {r.flag} {r.country}
                  </p>
                  <p className="mt-4 text-sm font-medium text-gold">{r.salary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Notice>
          <p>
            The salary range shown is <strong>indicative only</strong> and may
            represent gross or stated contractual pay. Actual compensation
            varies by employer, experience, qualifications, location, working
            hours and contract.
          </p>
          <p>
            Employment, work permits and visa approvals are decided by the
            employer and the relevant government authorities. Applying does not
            guarantee a job offer.
          </p>
        </Notice>
      </main>
    </div>
  );
}
