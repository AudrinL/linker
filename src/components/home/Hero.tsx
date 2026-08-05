"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitLines from "@/components/motion/SplitLines";
import MagneticButton from "@/components/ui/MagneticButton";
import { prefersReducedMotion } from "@/lib/utils";

const marks = [
  "Overseas Careers",
  "Visa Services",
  "Flights & Hotels",
  "Safari & Tours",
  "Vehicle Import",
];

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
          src="/img/hero-savanna.png"
          alt="A commercial airliner crossing the East African savanna at golden hour, with herds visible on the plains below"
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Grade: deepen the shadows, keep the amber, seat it in the palette.
            Kept tight — the image stays visible except where the copy sits. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-abyss) 58%, transparent) 0%, color-mix(in oklab, var(--color-abyss) 30%, transparent) 26%, transparent 50%), linear-gradient(to right, color-mix(in oklab, var(--color-abyss) 28%, transparent) 0%, transparent 34%)",
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
            className="mt-5 text-display font-display"
            lines={[
              "Where you go",
              'next is <em class="italic text-gradient-warm">not</em>',
              "a small thing.",
            ]}
          />

          <p className="mt-6 max-w-xl text-lede text-mist/90">
            A career abroad. A visa approved. A morning in the Volcanoes with
            gorillas. For eleven years we have moved people and possibilities
            between Africa and the world.
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
            <MagneticButton href="/safari-tours" variant="outline">
              Explore safaris
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Service marquee along the fold */}
      <div className="relative z-10 border-t border-mist/12">
        <div className="shell flex items-center justify-between gap-8 py-5">
          <ul className="hide-scrollbar flex items-center gap-7 overflow-x-auto">
            {marks.map((m) => (
              <li key={m} className="shrink-0">
                <Link
                  href="/services"
                  className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-mist/65 transition-colors duration-300 hover:text-gold"
                >
                  {m}
                </Link>
              </li>
            ))}
          </ul>

          <div
            aria-hidden
            className="hidden shrink-0 items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.24em] text-muted lg:flex"
          >
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-mist/20">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-gold" />
            </span>
          </div>
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
