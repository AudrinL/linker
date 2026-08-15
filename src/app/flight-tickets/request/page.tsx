import type { Metadata } from "next";
import { flightForm } from "@/lib/forms";
import { trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "Request a Flight",
  description:
    "Tell us about your trip and our travel team comes back with available options, schedules and pricing.",
};

export default function Page() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Flight Tickets"
        title="Request a flight"
        subtitle="Tell us about your trip and our travel team comes back with available options, schedules and pricing."
      />
      <main className="shell py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <MultiStepForm config={flightForm} />
        </div>
        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
