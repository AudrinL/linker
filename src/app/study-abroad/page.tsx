import type { Metadata } from "next";
import Link from "next/link";
import {
  studyCountries,
  studyServices,
  studyProgramCategories,
  studyEligibleApplicants,
  studyRequirements,
  studyJourney,
  studyBudgetItems,
  scholarshipSources,
  studyWhyUs,
  trustMarks,
} from "@/lib/services-data";
import { studyDestinations } from "@/lib/countries";
import { studyEligibility } from "@/lib/forms";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList, Checklist } from "@/components/ui/FeatureList";
import { DestinationPicker } from "@/components/ui/DestinationPicker";
import { EligibilityChecker } from "@/components/ui/EligibilityChecker";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { CountryGrid } from "@/components/ui/CountryGrid";
import { Notice } from "@/components/ui/Notice";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Study Abroad",
  description:
    "Explore study opportunities abroad with guidance through the whole education application process — choosing a destination and program, preparing admission documents and applying for a student visa.",
};

const routes = [
  {
    index: "01",
    title: "Universities",
    description: "Verified partner universities and courses matched to your grades, budget and ambitions.",
    href: "/study-abroad/universities",
    points: ["Country & course shortlists", "Scholarship matching", "Application support"],
  },
  {
    index: "02",
    title: "Study Visa",
    description: "Embassy-ready student visa files — including the funds and interview preparation that get approvals.",
    href: "/study-abroad/study-visa",
    points: ["Genuine student checks", "Document & funds advice", "Interview coaching"],
  },
  {
    index: "03",
    title: "Admission Guidance",
    description: "Honest advice on which programs you can realistically win — before you spend on tests and fees.",
    href: "/study-abroad/admission-guidance",
    points: ["Profile evaluation", "Pathway programs", "English test planning"],
  },
];

/** The end-to-end strip: one team from application through to departure. */
const oneStop = [
  "University selection",
  "Admission application",
  "Visa support",
  "Accommodation guidance",
  "Flight booking",
  "Pre-departure preparation",
];

export default function StudyAbroadHub() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Study Abroad"
        title="Your education. Your future. Your world."
        subtitle="We help students explore study opportunities abroad and guide them through the whole education application process — from choosing a destination and program to preparing admission and student visa documents."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
        <section className="flex flex-wrap items-center gap-4">
          <Link
            href="/study-abroad/apply"
            className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
          >
            Find my study program
          </Link>
          <Link
            href="/study-abroad/universities"
            className="rounded-full border border-mist/25 px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
          >
            Explore programs
          </Link>
        </section>

        <section>
          <SectionHeading
            eyebrow="Study destinations"
            title="Where do you want to study?"
            lede="Pick a destination and we carry it straight into your application."
          />
          <DestinationPicker
            destinations={studyDestinations}
            href="/study-abroad/apply"
            className="mt-10"
          />
        </section>

        <section>
          <SectionHeading
            eyebrow="Programs"
            title="What can you study?"
            lede="From foundation programs to doctoral research — and the language courses that open the door to both."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studyProgramCategories.map((c) => (
              <div
                key={c.title}
                className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7 transition-colors duration-500 hover:border-gold/35"
              >
                <h3 className="font-display text-xl tracking-tight text-bone">
                  {c.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {c.items.map((i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-mist"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-1 size-3.5 shrink-0 stroke-gold"
                        fill="none"
                        strokeWidth="2.4"
                        aria-hidden
                      >
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Our study abroad services"
            title="Seven parts, one team"
            lede="Everything between deciding to go and starting your first term."
          />
          <FeatureList features={studyServices} className="mt-12" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Explore"
            title="Start with a service"
            lede="We build your shortlist before you spend a single dollar on tests or application fees."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {routes.map((r) => (
              <ServiceCard key={r.index} {...r} />
            ))}
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Eligibility" title="Who can apply?" />
            <Checklist items={studyEligibleApplicants} columns={1} className="mt-8" />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Admission requirements vary by institution, course and
              destination.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Documentation" title="General requirements" />
            <Checklist items={studyRequirements} columns={1} className="mt-8" />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Not every applicant needs all of these — requirements vary by
              institution and country.
            </p>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Know where you stand"
            title="Check your study eligibility"
            lede="Three quick questions tell us whether a strong country match is realistic for you right now."
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <EligibilityChecker config={studyEligibility} />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="How the process works"
            title="From consultation to first lecture"
            lede="Eight steps. One consultant owns your file across all of them."
          />
          <ProcessTimeline steps={studyJourney} className="mx-auto mt-10 max-w-2xl" />
        </section>

        <section className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Study budget" title="What it actually costs" />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-mist">
              Your total study cost is more than tuition. We price the whole
              picture up front so nothing lands as a surprise in your second
              month.
            </p>
            <Checklist items={studyBudgetItems} columns={1} className="mt-7" />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Costs vary significantly by country, institution, program and
              lifestyle.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Scholarships" title="Studying with financial assistance" />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-mist">
              We help you understand which scholarship opportunities exist for
              your profile and what each one requires. Funding may come from:
            </p>
            <Checklist items={scholarshipSources} columns={1} className="mt-7" />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Scholarship availability, eligibility and funding vary by program.
            </p>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Destinations" title="Where you can study" />
          <CountryGrid countries={studyCountries} className="mt-10" />
        </section>

        <section className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/50 p-8 sm:p-10">
          <p className="eyebrow">One-stop study abroad support</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-bone">
            From application to departure
          </h2>
          <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
            {oneStop.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="rounded-full border border-gold/25 bg-gold/[0.07] px-4 py-2 text-sm tracking-tight text-bone">
                  {step}
                </span>
                {i < oneStop.length - 1 && (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="size-4 shrink-0 stroke-gold/50"
                    fill="none"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SectionHeading eyebrow="Why us" title="Why choose Linker World" />
          <FeatureList features={studyWhyUs} numbered={false} columns={3} className="mt-12" />
        </section>

        <TrustBar items={trustMarks} />

        <Notice>
          <p>
            Linker World Travel provides education and application support.{" "}
            <strong>
              Admission decisions are made by the relevant educational
              institution, and visa decisions by the appropriate immigration
              authorities.
            </strong>
          </p>
          <p>
            Admission, scholarships and visa approval are not guaranteed. They
            depend on your qualifications, documentation, the programs available
            and the requirements that apply at the time you apply.
          </p>
        </Notice>

        <StickyCTA
          title="Your future starts with the right opportunity"
          copy="Tell us your goals, grades and budget — we respond with a country and course shortlist within two working days."
          buttonText="Find my study program"
          buttonHref="/study-abroad/apply"
        />
      </main>
    </div>
  );
}
