import type { Metadata } from "next";
import { studyForm } from "@/lib/forms";
import { studyFaqs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Notice } from "@/components/ui/Notice";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Find Your Study Program",
  description:
    "Apply for study abroad in Canada, the UK, Germany and more. We build your country and course shortlist within two working days.",
};

export default function StudyApplyPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Study Abroad"
        title="Find your study program"
        subtitle="Tell us where you want to study and what you want to study. We respond with a country and course shortlist within two working days."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={studyForm} />
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <SectionHeading eyebrow="Before you apply" title="Common questions" />
          <Faq faqs={studyFaqs.slice(0, 4)} className="mt-10" />
        </div>

        <Notice className="mx-auto mt-16 max-w-4xl">
          <p>
            Submitting this form does not guarantee admission, scholarship
            funding or student visa approval. Admission decisions are made by
            the institution and visa decisions by the immigration authority.
          </p>
        </Notice>

        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
