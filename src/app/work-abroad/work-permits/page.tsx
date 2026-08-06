import type { Metadata } from "next";
import { workAbroadProcess, workGuides, workFaqs } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { GuideCard } from "@/components/ui/GuideCard";
import { Faq } from "@/components/ui/Faq";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Work Permits & Visas",
  description:
    "Work permit and visa processing handled with accuracy — eligibility assessment, documents, filing and embassy liaison, end to end.",
};

export default function WorkPermitsPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Work Abroad"
        title="Work Permits & Visas"
        subtitle="Expert guidance on international labour law and permit applications."
      />
      <main className="shell py-16 lg:py-24 space-y-24">
        <section>
          <SectionHeading
            eyebrow="The journey"
            title="From profile to payslip"
            lede="Every document, medical and embassy step handled for you."
          />
          <ProcessTimeline steps={workAbroadProcess} className="mt-10 mx-auto max-w-2xl" />
        </section>

        <section>
          <SectionHeading
            eyebrow="Downloadable guides"
            title="Get it right the first time"
            lede="Free PDF guides covering CVs, permit checklists and international interviews."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Permit FAQs" />
          <Faq faqs={workFaqs.slice(0, 4)} className="mt-10 max-w-3xl" />
        </section>

        <StickyCTA
          title="Avoid costly permit mistakes"
          copy="Tell us your profile and target country — we handle the paperwork end to end."
          buttonText="Apply now"
          buttonHref="/work-abroad/apply"
        />
      </main>
    </div>
  );
}
