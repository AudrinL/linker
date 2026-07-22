"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/utils";

const statement =
  "Some agencies sell tickets. We open doors. A visa is a career. A flight is a reunion. A permit is a family that eats better this year. We treat every file as though the whole life behind it depends on getting it right — because it usually does.";

/**
 * Scroll-scrubbed statement. Words resolve from dim to lit as the section
 * passes through the viewport, pacing the reader to the speed of the scroll.
 * The full sentence is always in the DOM, so it reads normally without JS.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);

      const words = root.current!.querySelectorAll("[data-word]");

      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            end: "bottom 62%",
            scrub: 0.5,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-abyss py-32 sm:py-44"
    >
      {/* Faint route texture, barely there */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "url(/img/texture-routes.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, var(--color-abyss) 78%)",
        }}
      />

      <div className="shell relative">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3.5">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="eyebrow">Why we exist</span>
          </div>

          <p className="mt-10 font-display text-[clamp(1.75rem,4.4vw,3.5rem)] leading-[1.16] tracking-[-0.025em]">
            {statement.split(" ").map((word, i) => (
              <span key={i} data-word className="inline-block">
                {word}
                {" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
