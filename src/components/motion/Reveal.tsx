"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, prefersReducedMotion } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds to hold before the reveal begins. */
  delay?: number;
  /** Distance travelled on the way in, in pixels. */
  y?: number;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: number;
  /** Viewport position that triggers the reveal. */
  start?: string;
};

/**
 * The site's baseline entrance: a short rise out of transparency, eased with
 * the shared expo curve. Deliberately understated — the photography and
 * typography carry the drama, motion only ushers them in.
 *
 * Rest state is declared in CSS (`.will-reveal`, `[data-stagger] > *`) so
 * content is never briefly visible before GSAP takes over on hydration.
 */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  y = 34,
  stagger,
  start = "top 84%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = stagger
        ? (gsap.utils.toArray(el.children) as HTMLElement[])
        : el;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: "expo.out",
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    },
    { scope: ref, dependencies: [delay, y, stagger, start] },
  );

  return (
    <Tag
      ref={ref}
      data-stagger={stagger ? "" : undefined}
      className={cn(!stagger && "will-reveal", className)}
    >
      {children}
    </Tag>
  );
}
