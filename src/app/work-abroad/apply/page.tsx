import type { Metadata } from "next";
import { workForm } from "@/lib/forms";
import { workFaqs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Apply for Work Abroad — Linker World Travel",
  description:
    "Apply to work in the Gulf, Europe or North America. Share your profile and documents — we reply within one working day.",
};

export default function WorkApplyPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Apply for work abroad"
        subtitle="Your profile goes straight to a consultant — not an inbox. We review every application within one working day."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={workForm} />
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <SectionHeading eyebrow="Before you apply" title="Common questions" />
          <Faq faqs={workFaqs.slice(0, 4)} className="mt-10" />
        </div>

        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
