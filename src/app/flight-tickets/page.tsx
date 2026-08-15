import type { Metadata } from "next";
import Link from "next/link";
import { flightServices, oneStopServices, trustMarks } from "@/lib/services-data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList } from "@/components/ui/FeatureList";
import { TrustBar } from "@/components/ui/TrustBar";
import { StickyCTA } from "@/components/ui/StickyCTA";

export const metadata: Metadata = {
  title: "Flight Tickets",
  description:
    "Domestic and international flight booking for work, study, business, tourism and family travel, arranged by a real travel team in Kigali.",
};

export default function FlightTicketsPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Flight Tickets"
        title="Book your journey"
        subtitle="Whether you are travelling for work, study, business, tourism or visiting family, we arrange domestic and international flight tickets."
      />

      <main className="shell space-y-24 py-16 lg:py-24">
        <section className="flex flex-wrap items-center gap-4">
          <Link
            href="/flight-tickets/request"
            className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
          >
            Book a flight
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-mist/25 px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-gold/70 hover:text-gold"
          >
            Talk to the travel desk
          </Link>
        </section>

        <section>
          <SectionHeading
            eyebrow="Flight booking services"
            title="Every kind of journey"
            lede="One team handles the ticket, the changes and the phone call when a connection falls through."
          />
          <FeatureList features={flightServices} numbered={false} columns={3} className="mt-12" />
        </section>

        <section className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/50 p-8 sm:p-10">
          <p className="eyebrow">One-stop travel services</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-bone">
            The flight is the last step, not the only one
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {oneStopServices.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-[var(--radius-sm)] border border-mist/15 bg-ink/60 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40"
              >
                <h3 className="font-display text-lg tracking-tight text-bone">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  {s.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold">
                  Explore
                  <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <TrustBar items={trustMarks} />

        <StickyCTA
          title="Tell us about your trip"
          copy="Share your route, dates and preferences. Our travel team comes back with available options, schedules and pricing."
          buttonText="Request flight options"
          buttonHref="/flight-tickets/request"
        />
      </main>
    </div>
  );
}
