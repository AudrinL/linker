import type { Metadata } from "next";
import { studyProcess, studyFaqs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { Faq } from "@/components/ui/Faq";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Study Visas",
  description:
    "Comprehensive support for securing your international student visa — financial proof, biometrics and interview coaching, end to end.",
};

export default function StudyVisaPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Study Abroad"
        title="Study Visas"
        subtitle="Comprehensive support for securing your international student visa."
      />
      <main className="shell py-16 lg:py-24 space-y-24">
        <section>
          <SectionHeading
            eyebrow="The journey"
            title="From offer to enrolment"
            lede="Financial proof, biometrics and consulate interviews — handled in the right order."
          />
          <ProcessTimeline steps={studyProcess} className="mt-10 mx-auto max-w-2xl" />
        </section>

        <section>
          <SectionHeading eyebrow="Questions" title="Student visa FAQs" />
          <Faq faqs={studyFaqs.slice(0, 5)} className="mt-10 max-w-3xl" />
        </section>

        <TrustBar items={trustMarks} />

        <StickyCTA
          title="Don't risk a refusal"
          copy="We build embassy-ready student visa files — and our 98% success rate is built on checking before you pay."
          buttonText="Start your application"
          buttonHref="/study-abroad/apply"
        />
      </main>
    </div>
  );
}
