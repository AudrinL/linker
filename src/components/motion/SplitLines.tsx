"use client";

import { useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, prefersReducedMotion } from "@/lib/utils";

type SplitLinesProps = {
  /** Each string becomes one masked line. Keep breaks intentional. */
  lines: string[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  delay?: number;
  stagger?: number;
  /** Play immediately on mount instead of waiting for scroll. */
  immediate?: boolean;
  start?: string;
};

/**
 * Masked line reveal — the signature headline motion. Each line sits inside its
 * own overflow-hidden box and rides up from below, so text appears to be
 * uncovered rather than faded in. Lines are authored explicitly rather than
 * measured at runtime, which keeps the break points art-directed at every
 * breakpoint and avoids a layout thrash on load.
 */
export default function SplitLines({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.09,
  immediate = false,
  start = "top 82%",
}: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const spans = el.querySelectorAll<HTMLElement>(".line-mask > span");

      if (prefersReducedMotion()) {
        gsap.set(spans, { yPercent: 0, opacity: 1 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        spans,
        { yPercent: 112, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.25,
          delay,
          stagger,
          ease: "expo.out",
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start, once: true },
        },
      );
    },
    { scope: ref, dependencies: [delay, stagger, immediate, start] },
  );

  // Widened so the shared HTMLElement ref satisfies every tag in the union.
  const Comp = Tag as ElementType;

  return (
    <Comp ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={cn("line-mask", lineClassName)}>
          <span
            // Rest state before GSAP hydrates, so nothing flashes unmasked.
            style={{ transform: "translateY(112%)", opacity: 0 }}
            dangerouslySetInnerHTML={{ __html: line }}
          />
        </span>
      ))}
    </Comp>
  );
}
