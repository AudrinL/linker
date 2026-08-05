import type { Metadata } from "next";
import { studyComparison, studyPricing, studyGuides, studyFaqs } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { PricingGrid } from "@/components/ui/PricingGrid";
import { GuideCard } from "@/components/ui/GuideCard";
import { Faq } from "@/components/ui/Faq";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Admission Guidance — Linker World Travel",
  description:
    "Honest advice on which programs you can realistically win — course selection, essays, scholarships and applications, end to end.",
};

export default function AdmissionGuidancePage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Admission Guidance"
        subtitle="From application essays to scholarships, we guide you every step of the way."
      />
      <main className="shell py-16 lg:py-24 space-y-24">
        <section>
          <SectionHeading
            eyebrow="Compare"
            title="Where does your profile fit best?"
            lede="Grades, budget and post-study plans side by side across the top destinations."
          />
          <ComparisonTable comparison={studyComparison} className="mt-10" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Transparent pricing"
            title="Admissions, staged"
            lede="You pay per milestone — matching, filing, visa — never a surprise invoice."
          />
          <PricingGrid tiers={studyPricing} className="mt-10" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Free guides"
            title="Write applications that win"
            lede="Statements of purpose, visa checklists and funding — downloadable PDFs."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studyGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Admission FAQs" />
          <Faq faqs={studyFaqs.slice(0, 4)} className="mt-10 max-w-3xl" />
        </section>

        <StickyCTA
          title="Secure your spot"
          copy="Tell us your grades and goals — we respond with a realistic shortlist within two working days."
          buttonText="Start your application"
          buttonHref="/study-abroad/apply"
        />
      </main>
    </div>
  );
}
