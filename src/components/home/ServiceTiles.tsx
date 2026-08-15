"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * The four doors into the business, placed directly under the hero.
 *
 * Visitors arrive knowing which of these four things they want — a job, a
 * course, a visa, a flight — so the first decision the page asks for is the
 * one they already made before they got here.
 */
const tiles = [
  {
    label: "Available Jobs",
    copy: "Explore international employment opportunities.",
    href: "/work-abroad/jobs",
    icon: (
      <>
        <path d="M3 8.5h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2v-10z" />
        <path d="M8.5 8.5V6a2 2 0 012-2h3a2 2 0 012 2v2.5" />
        <path d="M3 13h18" />
      </>
    ),
  },
  {
    label: "Study Abroad",
    copy: "Discover universities and education opportunities worldwide.",
    href: "/study-abroad",
    icon: (
      <>
        <path d="M12 4L2 9l10 5 10-5-10-5z" />
        <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
      </>
    ),
  },
  {
    label: "Visa Support",
    copy: "Get guidance with your visa application and documentation.",
    href: "/visa-support",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M8.5 17c.8-1.6 2-2.4 3.5-2.4s2.7.8 3.5 2.4" />
      </>
    ),
  },
  {
    label: "Flight Tickets",
    copy: "Book domestic and international flights.",
    href: "/travel/flight-booking",
    icon: <path d="M3 13.5l3-1 4.5-1.5-3.5-5.5 2-.5 5 5 4.5-1.5a2 2 0 011 3.8l-4.5 1.5-2 7-2 .5-.5-6.5-4.5 1.5-.5-2.3z" />,
  },
];

export default function ServiceTiles() {
  return (
    <section id="services-quick" className="shell py-16 lg:py-24">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <motion.div
            key={t.href}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={t.href}
              className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/[0.04]"
            >
              <span className="grid size-11 place-items-center rounded-full border border-gold/25 bg-gold/10">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 stroke-gold"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {t.icon}
                </svg>
              </span>
              <h3 className="mt-5 font-display text-xl tracking-tight text-bone">
                {t.label}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-mist">
                {t.copy}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold">
                Explore
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="mt-12 text-center font-display text-2xl tracking-tight text-bone sm:text-3xl">
        Find opportunities.{" "}
        <em className="italic text-gradient-cool">Build your career.</em> Go
        global.
      </p>
    </section>
  );
}
