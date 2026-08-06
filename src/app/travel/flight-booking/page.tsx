import type { Metadata } from "next";
import { flights, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Flight Booking",
  description:
    "International and regional flight booking with competitive fares — and a real person on the phone when plans change.",
};

export default function FlightBookingPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Travel & Visas"
        title="Flight Booking"
        subtitle="Secure the best routes and rates for your global travels."
      />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div>
          <h2 className="font-display text-3xl text-bone mb-8 text-center">Popular Routes</h2>
          <CardList items={flights} />
        </div>
        <TrustBar items={trustMarks} />
        <StickyCTA
          title="Looking for corporate rates?"
          copy="We offer special negotiated fares for group and corporate bookings — tell us your route and dates."
          buttonText="Request a quote"
          buttonHref="/contact"
        />
      </main>
    </div>
  );
}
