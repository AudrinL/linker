import type { Metadata } from "next";
import { safariForm } from "@/lib/forms";
import { safariFaqs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Plan Your Safari — Linker World Travel",
  description:
    "Tell us your dates and group. A safari specialist replies with a day-by-day itinerary within 24 hours.",
};

export default function SafariBookPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Plan your safari"
        subtitle="Tell us about your dates and group. A safari specialist replies with a day-by-day itinerary within 24 hours."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={safariForm} />
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <SectionHeading eyebrow="Before you book" title="Common questions" />
          <Faq faqs={safariFaqs.slice(0, 4)} className="mt-10" />
        </div>

        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
