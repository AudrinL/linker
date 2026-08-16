"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/lib/content";

/**
 * The four doors into the business, placed directly under the hero.
 *
 * Visitors arrive knowing which of these four things they want — work, study,
 * a visa, a flight — so the first decision the page asks for is the one they
 * already made before they got here.
 *
 * The labels, copy and order come from `services`, the same array the panel
 * stack further down renders, so the two can no longer disagree about what the
 * company sells. The icons are the one thing that stays here, keyed by slug.
 */
const icons: Record<string, React.ReactNode> = {
  recruitment: (
    <>
      <path d="M3 8.5h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2v-10z" />
      <path d="M8.5 8.5V6a2 2 0 012-2h3a2 2 0 012 2v2.5" />
      <path d="M3 13h18" />
    </>
  ),
  "study-abroad": (
    <>
      <path d="M12 4L2 9l10 5 10-5-10-5z" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
    </>
  ),
  "visa-services": (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M8.5 17c.8-1.6 2-2.4 3.5-2.4s2.7.8 3.5 2.4" />
    </>
  ),
  "travel-services": (
    <path d="M3 13.5l3-1 4.5-1.5-3.5-5.5 2-.5 5 5 4.5-1.5a2 2 0 011 3.8l-4.5 1.5-2 7-2 .5-.5-6.5-4.5 1.5-.5-2.3z" />
  ),
};

export default function ServiceTiles() {
  return (
    <section id="services-quick" className="shell py-28 sm:py-40">
      {/* Every other section on the page opens with this lockup; this one was
          the sole exception. */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 flex items-center gap-3.5"
      >
        <span className="h-px w-10 shrink-0 bg-gold/70" />
        <span className="eyebrow">Where to start</span>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={s.href}
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
                  {icons[s.slug]}
                </svg>
              </span>
              <h3 className="mt-5 font-display text-xl tracking-tight text-bone">
                {s.label}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-mist">
                {s.summary}
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

      <div className="mt-12 text-center">
        <p className="font-display text-2xl tracking-tight text-bone sm:text-3xl">
          Find opportunities.{" "}
          <em className="italic text-gradient-cool">Build your career.</em> Go
          global.
        </p>
        {/* The job board is an entry point rather than a fifth pillar, so it
            reads as a link here instead of competing as a tile. */}
        <Link
          href="/jobs"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors duration-300 hover:text-bone"
        >
          Or browse the jobs open right now
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
        </Link>
      </div>
    </section>
  );
}
