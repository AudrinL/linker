import type { Metadata } from "next";
import Link from "next/link";
import { trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import JobBoard from "@/components/jobs/JobBoard";
import { Notice } from "@/components/ui/Notice";
import { TrustBar } from "@/components/ui/TrustBar";
import { RichCTA } from "@/components/ui/RichCTA";

export const metadata: Metadata = {
  title: "Available Jobs",
  description:
    "Search international job opportunities by country, sector, employment type and skill level, then apply directly through Linker World Travel.",
};

export default function JobsPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Available Jobs"
        title="Find your next international opportunity"
        subtitle="Explore job opportunities across different countries and industries. Search by country, position, sector and employment type, then apply directly."
      />

      <main className="shell space-y-20 py-16 lg:py-24">
        <section className="flex flex-wrap items-center gap-4">
          <Link
            href="#search"
            className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
          >
            Search jobs
          </Link>
          <Link
            href="/submit-cv"
            className="rounded-full border border-mist/25 px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
          >
            Submit my CV
          </Link>
        </section>

        <JobBoard />

        <RichCTA
          title="Are you an employer?"
          description="Tell us what type of workers your company needs and we will review your requirements and identify suitable candidates."
          buttonText="Submit a job order"
          buttonHref="/employers"
        />

        <TrustBar items={trustMarks} />

        <Notice>
          <p>
            Salary ranges shown on this website are{" "}
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
      </main>
    </div>
  );
}
