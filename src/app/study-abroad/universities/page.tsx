import type { Metadata } from "next";
import { universities, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Partner Universities — Linker World Travel",
  description:
    "Gain admission to top-tier institutions worldwide — Canada, the UK, Germany, Australia, the US and Singapore.",
};

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Partner Universities"
        subtitle="Gain admission to top-tier educational institutions worldwide."
      />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-bone">Explore Top Destinations</h2>
            <p className="mt-3 text-mist">
              We have direct partnerships with institutions across the globe.
            </p>
          </div>
          <CardList items={universities} />
        </div>
        <TrustBar items={trustMarks} />
        <StickyCTA
          title="Find your dream school"
          copy="Tell us your grades and budget — we build a country and course shortlist within two working days."
          buttonText="Start your application"
          buttonHref="/study-abroad/apply"
        />
      </main>
    </div>
  );
}
