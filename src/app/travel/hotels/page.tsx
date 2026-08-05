import type { Metadata } from "next";
import { hotelHighlights, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Hotels & Accommodation — Linker World Travel",
  description:
    "Premium stays anywhere in the world — luxury resorts, business hotels, boutique stays and long-term apartments.",
};

export default function HotelsPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Hotels & Accommodation"
        subtitle="Find premium stays anywhere in the world."
      />
      <main className="shell py-16 lg:py-24 space-y-16">
        <BentoGrid items={hotelHighlights} />
        <TrustBar items={trustMarks} />
        <StickyCTA
          title="Book your stay"
          copy="Contact our agents to access unlisted rates and complimentary upgrades."
          buttonText="Book now"
          buttonHref="/contact"
        />
      </main>
    </div>
  );
}
