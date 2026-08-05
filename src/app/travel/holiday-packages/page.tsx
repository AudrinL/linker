import type { Metadata } from "next";
import { holidayPackages, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Holiday Packages — Linker World Travel",
  description:
    "Curated international getaways — Dubai, Europe and the Seychelles — tailored to your preferences.",
};

export default function HolidayPackagesPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Holiday Packages"
        subtitle="Curated international getaways tailored to your preferences."
      />
      <main className="shell py-16 lg:py-24 space-y-16">
        <CardList items={holidayPackages} />
        <TrustBar items={trustMarks} />
        <StickyCTA
          title="Custom itineraries available"
          copy="Want something different? We can tailor a package exactly to your dreams."
          buttonText="Plan my trip"
          buttonHref="/contact"
        />
      </main>
    </div>
  );
}
