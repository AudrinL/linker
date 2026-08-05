import type { Metadata } from "next";
import { visaForm } from "@/lib/forms";
import { visaFaqs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Start Your Visa Application — Linker World Travel",
  description:
    "Answer a few questions and upload your documents. We build an embassy-ready file and book your appointment.",
};

export default function VisaApplyPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Start your visa application"
        subtitle="Answer a few questions and upload your documents. We build an embassy-ready file and book your appointment."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={visaForm} />
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <SectionHeading eyebrow="Before you apply" title="Common questions" />
          <Faq faqs={visaFaqs.slice(0, 4)} className="mt-10" />
        </div>

        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
