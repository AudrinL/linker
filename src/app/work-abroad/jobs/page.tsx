import type { Metadata } from "next";
import { jobs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "International Job Board — Linker World Travel",
  description:
    "Verified overseas opportunities with visa sponsorship and relocation support, curated for East African professionals.",
};

export default function JobsPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="International Job Board"
        subtitle="Find verified overseas opportunities curated for East African professionals."
      />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-bone">Featured Opportunities</h2>
            <p className="mt-3 text-mist">
              Explore jobs with visa sponsorship and relocation support.
            </p>
          </div>
          <CardList items={jobs} />
        </div>
        <TrustBar items={trustMarks} />
        <StickyCTA
          title="Ready to advance your career?"
          copy="Upload your CV and let our matching experts find the perfect role for you — we review every application within one working day."
          buttonText="Submit your application"
          buttonHref="/work-abroad/apply"
        />
      </main>
    </div>
  );
}
