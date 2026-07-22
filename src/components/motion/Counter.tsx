"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/utils";

type CounterProps = {
  to: number;
  suffix?: string;
  className?: string;
};

/**
 * Counts up once when scrolled into view. Renders the final value in the
 * markup so the number is correct for crawlers, screen readers and any
 * visitor whose JavaScript never arrives.
 */
export default function Counter({ to, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      gsap.registerPlugin(ScrollTrigger);
      const counter = { v: 0 };

      gsap.to(counter, {
        v: to,
        duration: 2.1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(counter.v).toLocaleString("en-US");
        },
      });
    },
    { scope: ref, dependencies: [to] },
  );

  return (
    <span className={className}>
      <span ref={ref}>{to.toLocaleString("en-US")}</span>
      {suffix}
    </span>
  );
}
