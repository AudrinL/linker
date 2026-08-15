import type { Metadata } from "next";
import Link from "next/link";
import {
  workMarkets,
  opportunityFinder,
  studyOpportunityTypes,
  visaOpportunityTypes,
  travelOpportunityTypes,
  scholarshipCategories,
  trustMarks,
} from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList, Checklist } from "@/components/ui/FeatureList";
import { Notice } from "@/components/ui/Notice";
import { TrustBar } from "@/components/ui/TrustBar";
import { RichCTA } from "@/components/ui/RichCTA";
import Newsletter from "@/components/ui/Newsletter";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "International opportunities for work, study, scholarships, visas and travel, updated as new programs and vacancies become available.",
};

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Opportunities"
        title="Discover opportunities. Build your future. Go global."
        subtitle="Explore international opportunities for work, study, scholarships, travel and professional development, updated as new programs become available."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
        {/* ------------------------- find your route ------------------------ */}
        <section>
          <SectionHeading
            eyebrow="Find your opportunity"
            title="What are you looking for?"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {opportunityFinder.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="group rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/[0.04]"
              >
                <h3 className="font-display text-xl tracking-tight text-bone">
                  {o.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">
                  {o.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold">
                  Explore
                  <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------ work opportunities ---------------------- */}
        <section>
          <SectionHeading
            eyebrow="Work opportunities"
            title="Where the vacancies are"
            lede="Employment opportunities across the international markets we recruit into."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {workMarkets.map((m) => (
              <div
                key={m.country}
                className="flex flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7"
              >
                <h3 className="font-display text-xl tracking-tight text-bone">
                  <span aria-hidden>{m.flag}</span> {m.country}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                  {m.copy}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/jobs?country=${encodeURIComponent(m.country)}`}
                    className="rounded-full border border-mist/25 px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
                  >
                    View jobs
                  </Link>
                  <Link
                    href={`/work-abroad/apply?country=${encodeURIComponent(m.country)}`}
                    className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-white transition-colors duration-500 hover:bg-bone"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/jobs"
              className="inline-flex rounded-full border border-mist/25 px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
            >
              View all job opportunities
            </Link>
          </div>
        </section>

        {/* ------------------------ study opportunities --------------------- */}
        <section>
          <SectionHeading
            eyebrow="Study opportunities"
            title="Programs matched to your background"
            lede="International education based on your academic history, budget and career goals."
          />
          <FeatureList features={studyOpportunityTypes} numbered={false} columns={3} className="mt-12" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/study-abroad/apply"
              className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-white transition-colors duration-500 hover:bg-bone"
            >
              Apply to study abroad
            </Link>
            <Link
              href="/study-abroad/universities"
              className="rounded-full border border-mist/25 px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
            >
              Explore programs
            </Link>
          </div>
        </section>

        {/* ------------------------- scholarships --------------------------- */}
        <section id="scholarships">
          <SectionHeading
            eyebrow="Scholarship opportunities"
            title="Studying with financial assistance"
            lede="Funding offered by universities, governments and international organisations, and what each one asks for in return."
          />
          <Checklist items={scholarshipCategories} columns={2} className="mt-10" />
          <p className="mt-7 text-sm leading-relaxed text-muted">
            Scholarship availability, eligibility and funding depend on the
            specific institution or program.
          </p>
        </section>

        {/* ---------------------------- visa -------------------------------- */}
        <section className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Visa support" title="Categories we prepare" />
            <Checklist items={visaOpportunityTypes} columns={1} className="mt-8" />
            <Link
              href="/visa-support"
              className="mt-8 inline-flex rounded-full border border-mist/25 px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
            >
              Explore visa options
            </Link>
          </div>
          <div>
            <SectionHeading eyebrow="Travel" title="Getting you there" />
            <Checklist items={travelOpportunityTypes} columns={1} className="mt-8" />
            <Link
              href="/flight-tickets/request"
              className="mt-8 inline-flex rounded-full border border-mist/25 px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
            >
              Request a flight quote
            </Link>
          </div>
        </section>

        <Newsletter />

        <RichCTA
          title="For employers & institutions"
          description="An employer looking for international workers, or an institution looking to reach international students? We welcome professional partnership inquiries."
          buttonText="Submit a job order"
          buttonHref="/employers"
        />

        <TrustBar items={trustMarks} />

        <Notice>
          <p>
            Opportunities displayed on this website are{" "}
            <strong>subject to availability and eligibility</strong>. Job
            offers, admissions, scholarships, visas and travel arrangements are
            governed by the relevant employer, educational institution,
            immigration authority or service provider.
          </p>
          <p>
            Linker World Travel does not guarantee employment, admission,
            scholarship funding or visa approval.
          </p>
        </Notice>
      </main>
    </div>
  );
}
