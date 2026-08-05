"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Five services, five full-height panels that stack over one another as the
 * visitor scrolls — each one arriving as its own frame rather than as a card in
 * a grid. Sticky positioning does the stacking; GSAP only handles the parallax
 * drift on each plate and the entrance of the copy.
 */
export default function Services() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);

      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");

      panels.forEach((panel) => {
        const plate = panel.querySelector("[data-plate]");
        if (!plate) return;

        // Slow drift on the photography while the panel is on screen.
        gsap.fromTo(
          plate,
          { yPercent: -7, scale: 1.1 },
          {
            yPercent: 7,
            scale: 1.02,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="services" className="relative bg-abyss">
      <div className="shell relative z-10 pb-8 pt-28 sm:pt-36">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-3.5">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="eyebrow">What we do</span>
          </div>
          <h2 className="mt-7 text-headline font-display">
            Five services.
            <br />
            <em className="italic text-gradient-cool">One team</em> behind them.
          </h2>
          <p className="mt-7 max-w-xl text-lede text-mist/85">
            Most people come to us for one thing and stay for the next four. It
            is the same office, the same consultants, and the same standard
            whether you are booking a flight or relocating a family.
          </p>
        </Reveal>
      </div>

      <div ref={root} className="relative">
        {services.map((s, i) => (
          <article
            key={s.slug}
            data-panel
            className="sticky top-0 h-dvh w-full overflow-hidden"
            // Each panel sits a fraction higher than the last, so the stack
            // shows a sliver of the panel beneath it — depth, not a hard cut.
            style={{ zIndex: i + 1 }}
          >
            <div className="grain vignette relative h-full w-full overflow-hidden rounded-t-[var(--radius-2xl)]">
              <div data-plate className="absolute inset-0 will-change-transform">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  quality={82}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>

              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklab, var(--color-abyss) 82%, transparent) 0%, color-mix(in oklab, var(--color-abyss) 52%, transparent) 32%, color-mix(in oklab, var(--color-abyss) 14%, transparent) 74%), linear-gradient(to right, color-mix(in oklab, var(--color-abyss) 46%, transparent) 0%, transparent 56%)",
                }}
              />

              <div className="shell relative flex h-full items-end pb-16 sm:pb-24">
                <div className="grid w-full gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs tracking-[0.2em] text-gold">
                        {s.index}
                      </span>
                      <span className="h-px flex-1 max-w-24 bg-gold/40" />
                      <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-mist/70">
                        {s.kicker}
                      </span>
                    </div>

                    <h3 className="mt-5 text-headline font-display">
                      {s.title}
                    </h3>

                    <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed text-mist/85">
                      {s.blurb}
                    </p>

                    <Link
                      href={s.href}
                      className="group mt-9 inline-flex items-center gap-3 rounded-full border border-mist/25 py-3 pl-6 pr-4 text-sm font-medium tracking-tight transition-all duration-500 hover:border-gold/70 hover:bg-gold hover:text-white"
                      style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
                    >
                      {s.kicker}
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
                    </Link>
                  </div>

                  <ul className="glass hidden rounded-[var(--radius-lg)] p-7 lg:block">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-3.5 border-b border-mist/10 py-3.5 text-[0.92rem] leading-snug text-mist/90 last:border-0 last:pb-0 first:pt-0"
                      >
                        <span className="mt-[0.42rem] size-1.5 shrink-0 rounded-full bg-gold" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
