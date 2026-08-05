"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "solid" | "ghost" | "outline";
  className?: string;
  external?: boolean;
};

/**
 * Primary call to action. The button drifts a few pixels toward the cursor and
 * springs back on exit — enough to feel responsive under the hand, never enough
 * to become a toy. Pointer-fine only; touch devices get the static button.
 */
export default function MagneticButton({
  children,
  href,
  variant = "solid",
  className,
  external,
}: MagneticButtonProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);

    gsap.to(el, { x: x * 0.28, y: y * 0.4, duration: 0.6, ease: "power3.out" });
    // The label trails the shell slightly, which reads as depth.
    gsap.to(label.current, {
      x: x * 0.12,
      y: y * 0.18,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    gsap.to([wrap.current, label.current], {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const styles = {
    solid:
      "bg-gold text-white hover:bg-bone shadow-[0_10px_40px_-12px_rgba(180,83,9,0.4)]",
    outline:
      "border border-mist/30 bg-ink/30 text-bone backdrop-blur-md hover:border-gold/70 hover:text-gold",
    ghost: "text-bone/80 hover:text-gold",
  }[variant];

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block will-change-transform"
    >
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5",
          "text-sm font-medium tracking-tight transition-colors duration-500",
          styles,
          className,
        )}
      >
        <span ref={label} className="relative z-10 inline-flex items-center gap-2.5">
          {children}
        </span>
      </Link>
    </div>
  );
}
