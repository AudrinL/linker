import type { Metadata } from "next";
import Link from "next/link";
import {
  workAbroadProcess,
  workCountries,
  workServices,
  trustMarks,
} from "@/lib/services-data";
import { workDestinations } from "@/lib/countries";
import { workEligibility } from "@/lib/forms";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList } from "@/components/ui/FeatureList";
import { DestinationPicker } from "@/components/ui/DestinationPicker";
import { EligibilityChecker } from "@/components/ui/EligibilityChecker";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { CountryGrid } from "@/components/ui/CountryGrid";
import { Notice } from "@/components/ui/Notice";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Work Abroad",
  description:
    "We connect qualified candidates with international employment opportunities and support them through the whole application process — from CV to work permit to departure.",
};

const routes = [
  {
    index: "01",
    title: "Jobs",
    description: "Live overseas opportunities with visa sponsorship and relocation support, curated for East African professionals.",
    href: "/jobs",
    points: ["NHS, Gulf & EU employers", "Visa sponsorship listed", "Free CV review"],
  },
  {
    index: "02",
    title: "Recruitment",
    description: "End-to-end placement for skilled and semi-skilled professionals — from screening to pre-departure briefing.",
    href: "/work-abroad/recruitment",
    points: ["Skills verification", "Employer matching", "Post-placement support"],
  },
  {
    index: "03",
    title: "Employer Matching",
    description: "We align your profile with vetted vacancies across our employer network — you only interview for roles you can win.",
    href: "/work-abroad/employer-matching",
    points: ["Profile shortlisting", "Interview coaching", "No hidden fees"],
  },
  {
    index: "04",
    title: "Work Permits",
    description: "Permit and contract processing handled with the accuracy that gets approvals first time.",
    href: "/work-abroad/work-permits",
    points: ["Country-specific paperwork", "Contract review", "Compliance guidance"],
  },
];

export default function WorkAbroadHub() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Work Abroad"
        title="Work abroad"
        subtitle="We connect qualified candidates with international employment opportunities and provide support throughout the application process."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
        <section className="flex flex-wrap items-center gap-4">
          <Link
            href="/jobs"
            className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
          >
            View available jobs
          </Link>
          <Link
            href="/work-abroad/apply"
            className="rounded-full border border-mist/25 px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
          >
            Apply for a job abroad
          </Link>
        </section>

        <section>
          <SectionHeading
            eyebrow="Our services"
            title="What the service covers"
            lede="Eight things we actually do — not a list of promises, a list of work."
          />
          <FeatureList features={workServices} className="mt-12" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Choose where you want to work"
            title="Twenty-two destinations"
            lede="Pick a country and we carry it into your application."
          />
          <DestinationPicker
            destinations={workDestinations}
            href="/work-abroad/apply"
            className="mt-10"
          />
        </section>

        <section>
          <SectionHeading
            eyebrow="Explore"
            title="Start with a service"
            lede="Every route below is handled end to end by one team from Kigali. Begin where you are."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {routes.map((r) => (
              <ServiceCard key={r.index} {...r} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Know where you stand"
            title="Check your eligibility first"
            lede="Two minutes now saves a refused application later. This is the same screen our consultants run before any conversation."
          />
          <div className="mt-10 mx-auto max-w-3xl">
            <EligibilityChecker config={workEligibility} />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="How it works"
            title="From profile to payslip"
            lede="A transparent process with no surprises — and no fees until a role is secured."
          />
          <ProcessTimeline steps={workAbroadProcess} className="mt-10 mx-auto max-w-2xl" />
        </section>

        <section>
          <SectionHeading eyebrow="Destinations" title="Where we place" />
          <CountryGrid countries={workCountries} className="mt-10" />
        </section>

        <TrustBar items={trustMarks} />

        <Notice>
          <p>
            Salary ranges shown across this site are{" "}
            <strong>indicative only</strong> and may represent gross or stated
            contractual pay depending on the country and vacancy. Actual
            compensation varies by employer, occupation, experience,
            qualifications, location, working hours and contract.
          </p>
          <p>
            Employment, work permits and visa approvals are subject to the
            employer and the relevant government authorities. Linker World
            Travel does not guarantee employment, work-permit approval or visa
            approval.
          </p>
        </Notice>

        <StickyCTA
          title="Ready to see your profile in front of real employers?"
          copy="Submit your profile and documents — we review every application within one working day and reply on WhatsApp."
          buttonText="Apply now"
          buttonHref="/work-abroad/apply"
        />
      </main>
    </div>
  );
}
