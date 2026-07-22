"use client";

import { useState } from "react";
import { testimonials } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Testimonials as editorial pull-quotes rather than review cards: one story at
 * a time, set large, with the roster of names doubling as the navigation.
 * Slots for video testimonials later — the layout already reserves the frame.
 */
export default function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="relative overflow-hidden bg-ink py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[45%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 55% 100% at 50% -18%, var(--color-deep) 0%, transparent 68%)",
        }}
      />

      <div className="shell relative">
        <Reveal className="flex items-center gap-3.5">
          <span className="h-px w-10 shrink-0 bg-gold/70" />
          <span className="eyebrow">In their words</span>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div>
            <blockquote>
              <p
                key={active}
                className="font-display text-[clamp(1.5rem,3.3vw,2.65rem)] leading-[1.22] tracking-[-0.02em] text-bone"
                style={{ animation: "quotein 900ms var(--ease-out-expo) both" }}
              >
                <span className="text-gold">“</span>
                {t.quote}
                <span className="text-gold">”</span>
              </p>
              <footer className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2">
                <cite className="not-italic text-[0.95rem] font-medium tracking-tight text-bone">
                  {t.name}
                </cite>
                <span className="text-mist/45">·</span>
                <span className="text-[0.9rem] text-muted">{t.role}</span>
                <span className="rounded-full border border-gold/35 px-3.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-gold">
                  {t.service}
                </span>
              </footer>
            </blockquote>
          </div>

          <ul className="flex flex-col justify-center gap-1 lg:border-l lg:border-mist/12 lg:pl-10">
            {testimonials.map((item, i) => (
              <li key={item.name}>
                <button
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-[var(--radius-sm)] px-4 py-4 text-left transition-colors duration-500",
                    i === active ? "bg-bone/[0.06]" : "hover:bg-bone/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "block h-8 w-px shrink-0 transition-colors duration-500",
                      i === active ? "bg-gold" : "bg-mist/20",
                    )}
                  />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-[0.95rem] font-medium tracking-tight transition-colors duration-500",
                        i === active
                          ? "text-bone"
                          : "text-mist/70 group-hover:text-bone",
                      )}
                    >
                      {item.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.8rem] text-muted">
                      {item.service}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes quotein {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes quotein { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>
    </section>
  );
}
