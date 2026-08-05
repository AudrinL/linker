import type { Metadata } from "next";
import { workComparison, workPricing, workFaqs } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { PricingGrid } from "@/components/ui/PricingGrid";
import { Faq } from "@/components/ui/Faq";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Employer Matching — Linker World Travel",
  description:
    "We align your profile with vetted vacancies across our employer network — you only interview for roles you can win.",
};

export default function EmployerMatchingPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Employer Matching"
        subtitle="Tailored placement services ensuring the right fit for both candidate and company."
      />
      <main className="shell py-16 lg:py-24 space-y-24">
        <section>
          <SectionHeading
            eyebrow="Which route fits?"
            title="Match the route to your profile"
            lede="We go beyond resumes — human judgement on top of the paperwork, so you only interview for roles you can win."
          />
          <ComparisonTable comparison={workComparison} className="mt-10" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Transparent pricing"
            title="Fees, staged to milestones"
            lede="No hidden fees. You only pay as each milestone actually completes."
          />
          <PricingGrid tiers={workPricing} className="mt-10" />
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Employer matching FAQs" />
          <Faq faqs={workFaqs.slice(0, 4)} className="mt-10 max-w-3xl" />
        </section>

        <StickyCTA
          title="See your profile in front of real employers"
          copy="Tell us your skills and where you want to go — we match you to vetted vacancies within one working day."
          buttonText="Start matching"
          buttonHref="/work-abroad/apply"
        />
      </main>
    </div>
  );
}
