import type { Metadata } from "next";
import {
  safariHighlights,
  safariPackages,
  safariProcess,
  safariPricing,
  safariFaqs,
  safariGuides,
  trustMarks,
} from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { CardList } from "@/components/ui/CardList";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { PricingGrid } from "@/components/ui/PricingGrid";
import { GuideCard } from "@/components/ui/GuideCard";
import { Faq } from "@/components/ui/Faq";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "East African Safaris — Linker World Travel",
  description:
    "Gorilla trekking, the Great Migration and Big Five drives across Rwanda, Kenya, Tanzania and Uganda — designed the way we would for family.",
};

export default function SafariToursPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="East African Safaris"
        subtitle="Experience the wild beauty of Rwanda, Kenya, and Tanzania."
      />
      <main className="shell py-16 lg:py-24 space-y-24">
        <section>
          <SectionHeading eyebrow="The experiences" title="Wild by design" />
          <div className="mt-10">
            <BentoGrid items={safariHighlights} />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Signature trips"
            title="Packages that do the planning for you"
            lede="Permits, lodges and transfers included — the price we quote is the price you pay."
          />
          <div className="mt-10">
            <CardList items={safariPackages} />
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="How it works" title="From enquiry to first light" />
          <ProcessTimeline steps={safariProcess} className="mt-10 mx-auto max-w-2xl" />
        </section>

        <section>
          <SectionHeading eyebrow="Pricing" title="Safaris for every budget" />
          <PricingGrid tiers={safariPricing} className="mt-10" />
        </section>

        <section>
          <SectionHeading eyebrow="Free guides" title="Plan like a local" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {safariGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Safari FAQs" />
          <Faq faqs={safariFaqs.slice(0, 5)} className="mt-10 max-w-3xl" />
        </section>

        <TrustBar items={trustMarks} />

        <StickyCTA
          title="Into the wild"
          copy="Tell us your dates and group — a safari specialist replies with a day-by-day itinerary within 24 hours."
          buttonText="Plan your safari"
          buttonHref="/safari-tours/book"
        />
      </main>
    </div>
  );
}
