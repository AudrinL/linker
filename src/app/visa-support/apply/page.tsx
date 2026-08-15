import type { Metadata } from "next";
import { visaForm } from "@/lib/forms";
import { visaFaqs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Notice } from "@/components/ui/Notice";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Request Visa Support",
  description:
    "Tell us where you are going and why. We reply with the document checklist for your visa category within one working day.",
};

export default function VisaApplyPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Visa Support"
        title="Request visa support"
        subtitle="Answer a few questions and add what documents you have. We reply with the checklist for your category and what to prepare next."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={visaForm} />
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <SectionHeading eyebrow="Before you apply" title="Common questions" />
          <Faq faqs={visaFaqs.slice(0, 4)} className="mt-10" />
        </div>

        <Notice className="mx-auto mt-16 max-w-4xl" title="Important visa notice">
          <p>
            Visa approval or refusal is determined solely by the relevant
            embassy, consulate or immigration authority. Submitting this request
            does not guarantee a visa.
          </p>
        </Notice>

        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
