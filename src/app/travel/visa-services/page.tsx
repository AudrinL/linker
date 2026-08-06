import type { Metadata } from "next";
import {
  visaProcess,
  visaComparison,
  visaPricing,
  visaFaqs,
  visaGuides,
  trustMarks,
} from "@/lib/services-data";
import { visaEligibility } from "@/lib/forms";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EligibilityChecker } from "@/components/ui/EligibilityChecker";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { PricingGrid } from "@/components/ui/PricingGrid";
import { GuideCard } from "@/components/ui/GuideCard";
import { Faq } from "@/components/ui/Faq";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Travel Visa Services",
  description:
    "Hassle-free tourist, business, work and student visa processing — honest eligibility checks before you pay a franc.",
};

export default function VisaServicesPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Travel & Visas"
        title="Travel Visa Services"
        subtitle="Hassle-free tourist, business, work and student visa processing."
      />
      <main className="shell py-16 lg:py-24 space-y-24">
        <section>
          <SectionHeading
            eyebrow="Know where you stand"
            title="Free eligibility check"
            lede="Two minutes now saves a refused application later. The same screen our consultants run on every file."
          />
          <div className="mt-10 mx-auto max-w-3xl">
            <EligibilityChecker config={visaEligibility} />
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="The journey"
            title="From quiz to stamped passport"
          />
          <ProcessTimeline steps={visaProcess} className="mt-10 mx-auto max-w-2xl" />
        </section>

        <section>
          <SectionHeading eyebrow="Compare" title="Which visa do you need?" />
          <ComparisonTable comparison={visaComparison} className="mt-10" />
        </section>

        <section>
          <SectionHeading eyebrow="Transparent pricing" title="Visa fees, itemised" />
          <PricingGrid tiers={visaPricing} className="mt-10" />
        </section>

        <section>
          <SectionHeading eyebrow="Free guides" title="Get approved first time" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {visaGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Visa FAQs" />
          <Faq faqs={visaFaqs.slice(0, 5)} className="mt-10 max-w-3xl" />
        </section>

        <TrustBar items={trustMarks} />

        <StickyCTA
          title="Fast-track your visa"
          copy="Don't let paperwork ruin your travel plans. Answer a few questions and we build a decision-ready file."
          buttonText="Start your visa application"
          buttonHref="/travel/visa-services/apply"
        />
      </main>
    </div>
  );
}
