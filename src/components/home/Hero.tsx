"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitLines from "@/components/motion/SplitLines";
import MagneticButton from "@/components/ui/MagneticButton";
import { heroStats } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * The opening frame.
 *
 * On load the plate is held slightly over-scaled and drifts back to rest while
 * the headline is uncovered line by line — the effect of a camera settling.
 * On scroll the plate continues to recede and dim as the copy lifts away,
 * so the hero hands off to the next section instead of simply scrolling off.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);

      // Entrance: the camera settles.
      gsap.fromTo(
        plate.current,
        { scale: 1.16, filter: "brightness(0.55)" },
        {
          scale: 1,
          filter: "brightness(1)",
          duration: 2.4,
          ease: "expo.out",
        },
      );

      // Scroll: plate recedes, copy lifts, everything dims toward the fold.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      tl.to(plate.current, { scale: 1.14, yPercent: 8, ease: "none" }, 0)
        .to(copy.current, { yPercent: -34, opacity: 0, ease: "none" }, 0);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate grain flex min-h-dvh flex-col justify-end overflow-hidden"
    >
      {/* Photographic plate */}
      <div ref={plate} className="absolute inset-0 -z-10 will-change-transform">
        <Image
          src="/assets/hero%20image.png"
          alt="Travel across Africa and beyond: the world Linker World Travel opens to you"
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Grade: deepen the shadows, keep the amber, seat it in the palette.
            Dense at the base where the copy sits, clear above so the
            photography stays the hero. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-bone) 78%, transparent) 0%, color-mix(in oklab, var(--color-bone) 48%, transparent) 28%, transparent 58%), linear-gradient(to right, color-mix(in oklab, var(--color-bone) 42%, transparent) 0%, transparent 48%)",
          }}
        />
        <div className="vignette absolute inset-0" />
      </div>

      <div className="shell relative z-10 flex flex-1 items-end pb-9 pt-20 sm:pb-12">
        <div ref={copy} className="max-w-4xl">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="eyebrow">Kigali · Rwanda · Est. 2014</span>
          </div>

          <SplitLines
            as="h1"
            immediate
            delay={0.35}
            className="mt-5 text-display font-display text-white"
            lines={[
              "Your journey to",
              'the <em class="italic text-gradient-warm-dark">world</em>',
              "starts here.",
            ]}
          />

          <p className="mt-6 max-w-xl text-lede text-white/80">
            We help you find opportunities to work, study, travel and build your
            future internationally, from the first conversation to the day you
            land.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <MagneticButton href="/contact">
              Start your journey
              <svg
                viewBox="0 0 16 16"
                className="size-3.5 transition-transform duration-500 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticButton>
            <MagneticButton href="/#services" variant="outline">
              Explore our services
            </MagneticButton>
          </div>

          {/* Both of these sit over the bright part of the plate, so they hold
              at /75 rather than the /40 they were set at, where they were
              unreadable against the sky. */}
          <p className="mt-4 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/75">
            Free consultation · No upfront fee · Reply within one working day
          </p>

          {/* A fixed two-column grid: as a wrapping flex row these four broke
              into ragged, uneven lines on narrow screens. */}
          <dl className="mt-9 grid max-w-lg grid-cols-2 gap-x-8 gap-y-3.5">
            {heroStats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                {/* Stacked on phones: side by side, the longer labels wrapped
                    mid-phrase against the value. */}
                <dd className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="font-display text-xl tracking-tight text-white">{s.value}</span>
                  <span aria-hidden className="text-[0.68rem] font-medium uppercase tracking-[0.15em] text-white/75">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Scroll cue.
          This replaces a full-width strip of service links that sat here. That
          strip repeated, in dark `mist` type on dark photography, the same four
          doors the tile grid presents in full immediately below it — so it was
          both illegible and redundant, and removing it lets the hero end on the
          proof numbers instead of a second navigation. */}
      <div
        aria-hidden
        className="relative z-10 hidden items-center justify-end gap-2.5 pb-8 text-[0.68rem] uppercase tracking-[0.24em] text-white/70 lg:flex"
      >
        <div className="shell flex items-center justify-end gap-2.5">
          Scroll
          <span className="relative block h-8 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-gold" />
          </span>
        </div>
      </div>

      <style>{`
        @keyframes scrollcue {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(320%); }
        }
      `}</style>
    </section>
  );
}
