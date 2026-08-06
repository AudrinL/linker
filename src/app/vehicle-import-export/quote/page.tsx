import type { Metadata } from "next";
import { vehicleForm } from "@/lib/forms";
import { vehicleFaqs, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Request a Vehicle Quote",
  description:
    "Request a fully itemised landed price for importing or exporting a vehicle. We reply within 24 hours.",
};

export default function VehicleQuotePage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Vehicle Import"
        title="Request a vehicle quote"
        subtitle="Give us the details and we come back within 24 hours with a fully itemised landed price."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={vehicleForm} />
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <SectionHeading eyebrow="Before you request" title="Common questions" />
          <Faq faqs={vehicleFaqs.slice(0, 4)} className="mt-10" />
        </div>

        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
