import type { Metadata } from "next";
import { studyForm } from "@/lib/forms";
import { studyFaqs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Apply for Study Abroad — Linker World Travel",
  description:
    "Apply for study abroad in Canada, the UK, Germany and more. We build your country and course shortlist within two working days.",
};

export default function StudyApplyPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Apply for study abroad"
        subtitle="Tell us your goals and documents. We respond with a country and course shortlist within two working days."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={studyForm} />
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <SectionHeading eyebrow="Before you apply" title="Common questions" />
          <Faq faqs={studyFaqs.slice(0, 4)} className="mt-10" />
        </div>

        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
