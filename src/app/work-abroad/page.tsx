import type { Metadata } from "next";
import {
  workAbroadProcess,
  workCountries,
  trustMarks,
} from "@/lib/services-data";
import { workEligibility } from "@/lib/forms";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EligibilityChecker } from "@/components/ui/EligibilityChecker";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { CountryGrid } from "@/components/ui/CountryGrid";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Work Abroad",
  description:
    "Jobs, recruitment and work permits across the Gulf, Europe and North America. Vetted employers, honest eligibility checks and support from first interview to first payslip.",
};

const routes = [
  {
    index: "01",
    title: "Jobs",
    description: "Live overseas opportunities with visa sponsorship and relocation support, curated for East African professionals.",
    href: "/work-abroad/jobs",
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
        subtitle="Vetted employers, honest eligibility checks and support from first interview to first payslip — across the Gulf, Europe and North America."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
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
