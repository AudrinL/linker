import type { Metadata } from "next";
import { trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { TrustBar } from "@/components/ui/TrustBar";
import { BentoGrid } from "@/components/ui/BentoGrid";

export const metadata: Metadata = {
  title: "Travel & Visas",
  description:
    "Flight booking, hotels, holiday packages and visa services — handled by a real person from Kigali, with honest eligibility checks before you pay.",
};

const routes = [
  {
    index: "01",
    title: "Flight Booking",
    description: "Competitive international and regional fares with a real person on the phone when plans change.",
    href: "/travel/flight-booking",
    points: ["Group & family fares", "Change-friendly bookings", "Airport assistance"],
  },
  {
    index: "02",
    title: "Hotels",
    description: "Considered stays worldwide — from business hotels to long-term apartments for expats and students.",
    href: "/travel/hotels",
    points: ["Business & luxury stays", "Long-term apartments", "Best-rate matching"],
  },
  {
    index: "03",
    title: "Holiday Packages",
    description: "Itineraries built around how you actually want to travel — Dubai, Europe, the Seychelles and more.",
    href: "/travel/holiday-packages",
    points: ["Tailored itineraries", "Couples & families", "Local guides included"],
  },
  {
    index: "04",
    title: "Visa Services",
    description: "Work, study and tourist visas prepared with the precision that gets applications approved first time.",
    href: "/travel/visa-services",
    points: ["Honest eligibility checks", "Document & translation support", "Appointment booking"],
  },
];

const highlights = [
  { title: "24h response", description: "We reply to every enquiry within one working day.", className: "md:col-span-1" },
  { title: "One consultant per trip", description: "The person who plans your trip handles every change to it.", className: "md:col-span-2" },
  { title: "Visa before you pay", description: "We assess your eligibility honestly before you spend anything.", className: "md:col-span-2" },
  { title: "East African specialists", description: "Safaris, Gulf routes and regional travel as home turf.", className: "md:col-span-1" },
];

export default function TravelHub() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Travel & Visas"
        title="Travel & visas"
        subtitle="Flights, hotels, holiday packages and visas — planned by a real person in Kigali, with honest eligibility checks before you pay a franc."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
        <section>
          <SectionHeading
            eyebrow="Explore"
            title="Start with a service"
            lede="Every booking is handled end to end by one consultant who answers the phone."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {routes.map((r) => (
              <ServiceCard key={r.index} {...r} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Why us" title="Travel without the runaround" />
          <div className="mt-10">
            <BentoGrid items={highlights} />
          </div>
        </section>

        <TrustBar items={trustMarks} />

        <StickyCTA
          title="Planning a trip or a move?"
          copy="Tell us where you're going, when, and what you need — we reply within one working day."
          buttonText="Start your visa application"
          buttonHref="/travel/visa-services/apply"
        />
      </main>
    </div>
  );
}
