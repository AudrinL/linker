import type { Metadata } from "next";
import {
  studyProcess,
  studyCountries,
  trustMarks,
} from "@/lib/services-data";
import { studyEligibility } from "@/lib/forms";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EligibilityChecker } from "@/components/ui/EligibilityChecker";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { CountryGrid } from "@/components/ui/CountryGrid";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Study Abroad — Linker World Travel",
  description:
    "University admissions, study visas and scholarship guidance for Canada, the UK, Germany, Australia, the US and Singapore.",
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

export default function StudyAbroadHub() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Study abroad"
        subtitle="University admissions, study visas and scholarships — matched honestly to your grades, your budget and where you want to be."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
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

        <section>
          <SectionHeading
            eyebrow="Know where you stand"
            title="Check your study eligibility"
            lede="Three quick questions tell us whether a strong country match is realistic for you right now."
          />
          <div className="mt-10 mx-auto max-w-3xl">
            <EligibilityChecker config={studyEligibility} />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="How it works"
            title="From enquiry to enrolment"
            lede="One consultant owns your file from the first call to your first lecture."
          />
          <ProcessTimeline steps={studyProcess} className="mt-10 mx-auto max-w-2xl" />
        </section>

        <section>
          <SectionHeading eyebrow="Destinations" title="Where you can study" />
          <CountryGrid countries={studyCountries} className="mt-10" />
        </section>

        <TrustBar items={trustMarks} />

        <StickyCTA
          title="Your degree is closer than you think"
          copy="Tell us your goals and documents — we respond with a country and course shortlist within two working days."
          buttonText="Start your application"
          buttonHref="/study-abroad/apply"
        />
      </main>
    </div>
  );
}
