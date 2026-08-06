import type { Metadata } from "next";
import {
  vehicleProcess,
  vehicleComparison,
  vehiclePricing,
  vehicleFaqs,
  vehicleGuides,
  trustMarks,
} from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { PricingGrid } from "@/components/ui/PricingGrid";
import { GuideCard } from "@/components/ui/GuideCard";
import { Faq } from "@/components/ui/Faq";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Vehicle Import & Export",
  description:
    "Sourcing, shipping, clearing and delivering vehicles across continents — with independent inspection before you pay.",
};

export default function VehicleImportExportPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Vehicle Import"
        title="Vehicle Import & Export"
        subtitle="Reliable cross-border vehicle logistics and purchasing assistance."
      />
      <main className="shell py-16 lg:py-24 space-y-24">
        <section>
          <SectionHeading
            eyebrow="The journey"
            title="From spec to driveway"
            lede="Every port, form and inspection between you and your vehicle."
          />
          <ProcessTimeline steps={vehicleProcess} className="mt-10 mx-auto max-w-2xl" />
        </section>

        <section>
          <SectionHeading eyebrow="Compare" title="Import vs export at a glance" />
          <ComparisonTable comparison={vehicleComparison} className="mt-10" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Transparent pricing"
            title="Landed prices, itemised"
            lede="Vehicle + freight + duty + clearance + fee. No single scary number."
          />
          <PricingGrid tiers={vehiclePricing} className="mt-10" />
        </section>

        <section>
          <SectionHeading eyebrow="Free guides" title="Know the process before you pay" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {vehicleGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Vehicle FAQs" />
          <Faq faqs={vehicleFaqs.slice(0, 5)} className="mt-10 max-w-3xl" />
        </section>

        <TrustBar items={trustMarks} />

        <StickyCTA
          title="Looking for a specific car?"
          copy="Tell us the make and model — we source it with an independent inspection before you pay a franc."
          buttonText="Request a quote"
          buttonHref="/vehicle-import-export/quote"
        />
      </main>
    </div>
  );
}
