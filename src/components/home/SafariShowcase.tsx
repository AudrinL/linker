"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { destinations } from "@/lib/content";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn, prefersReducedMotion } from "@/lib/utils";

/**
 * The safari chapter — the site's strongest visual moment.
 *
 * The section pins and four destinations advance as the visitor scrolls
 * through it: the plate cross-dissolves, the country name counts up, and the
 * copy swaps. It reads as a sequence of frames from one film rather than four
 * separate cards. Below the pin, a static grid carries the same content for
 * touch, keyboard and reduced-motion visitors.
 */
export default function SafariShowcase() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);

      // Only pin where there is room for the composition to breathe.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${destinations.length * 85}%`,
          pin: "[data-pin]",
          scrub: false,
          onUpdate: (self) => {
            const i = Math.min(
              destinations.length - 1,
              Math.floor(self.progress * destinations.length),
            );
            setActive(i);
          },
        });
        return () => st.kill();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="safari"
      className="relative bg-abyss"
      aria-label="Safari destinations"
    >
      <div data-pin className="relative h-dvh w-full overflow-hidden">
        {/* Cross-dissolving plates */}
        {destinations.map((d, i) => (
          <div
            key={d.country}
            aria-hidden={i !== active}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1100ms]",
              i === active ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionTimingFunction: "var(--ease-in-out-soft)" }}
          >
            <Image
              src={d.image}
              alt={
                i === active
                  ? `${d.experience} in ${d.country} — ${d.headline}`
                  : ""
              }
              fill
              quality={82}
              sizes="100vw"
              className={cn(
                "object-cover object-center transition-transform duration-[2400ms]",
                i === active ? "scale-100" : "scale-105",
              )}
            />
          </div>
        ))}

        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-abyss) 80%, transparent) 0%, color-mix(in oklab, var(--color-abyss) 50%, transparent) 36%, color-mix(in oklab, var(--color-abyss) 12%, transparent) 80%), linear-gradient(to right, color-mix(in oklab, var(--color-abyss) 44%, transparent) 0%, transparent 52%)",
          }}
        />
        <div className="vignette absolute inset-0" />
        <div className="grain absolute inset-0 overflow-hidden" />

        <div className="shell relative flex h-full flex-col justify-end pb-16 pt-28 sm:pb-24">
          <div className="flex items-center gap-3.5">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="eyebrow">Safari &amp; Tours · East Africa</span>
          </div>

          <div className="mt-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              {/* Country: swapped, not animated per-letter — legibility first */}
              <p
                key={destinations[active].country}
                className="text-[0.72rem] font-medium uppercase tracking-[0.26em] text-gold"
              >
                {destinations[active].experience}
              </p>
              <h2 className="mt-4 text-headline font-display">
                {destinations[active].country}
              </h2>
              <p className="mt-3 font-display text-[clamp(1.2rem,2.2vw,1.75rem)] italic text-mist/80">
                {destinations[active].headline}
              </p>
            </div>

            <div>
              <p className="max-w-md text-[1.02rem] leading-relaxed text-mist/85">
                {destinations[active].copy}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {destinations[active].highlights.map((h) => (
                  <li
                    key={h}
                    className="glass rounded-full px-4 py-2 text-xs font-medium tracking-tight text-mist"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <MagneticButton href="/safari-tours">
                  Plan a safari
                  <svg
                    viewBox="0 0 16 16"
                    className="size-3.5 transition-transform duration-500 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden
                  >
                    <path
                      d="M2 8h11M9 4l4 4-4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Progress rail — also a control on touch and keyboard */}
          <div className="mt-12 flex gap-2.5">
            {destinations.map((d, i) => (
              <button
                key={d.country}
                onClick={() => setActive(i)}
                aria-label={`Show ${d.country}`}
                aria-current={i === active}
                className="group flex-1 py-3"
              >
                <span className="block h-px w-full bg-mist/25">
                  <span
                    className={cn(
                      "block h-px origin-left bg-gold transition-transform duration-[900ms]",
                      i === active ? "scale-x-100" : "scale-x-0",
                    )}
                    style={{
                      transitionTimingFunction: "var(--ease-out-expo)",
                    }}
                  />
                </span>
                <span
                  className={cn(
                    "mt-3 block text-left text-[0.7rem] font-medium uppercase tracking-[0.18em] transition-colors duration-500",
                    i === active
                      ? "text-bone"
                      : "text-muted group-hover:text-mist",
                  )}
                >
                  {d.country}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
