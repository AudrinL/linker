"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Inner-page hero. No photography — instead uses the brand's warm cream canvas
 * with an amber glow so the section feels grounded in the design system without
 * competing with the cinematic photo heroes on the home and contact pages.
 */
export function PageHero({ eyebrow, title, subtitle, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-abyss pt-36 pb-20 lg:pt-48 lg:pb-28",
        className,
      )}
    >
      {/* Warm amber horizon glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 120%, var(--color-amber) 0%, transparent 65%)",
        }}
      />
      {/* Left-side warm wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 0% 60%, var(--color-gold) 0%, transparent 70%)",
        }}
      />

      <div className="shell relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3.5">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="eyebrow">{eyebrow ?? "Overview"}</span>
          </div>

          <h1 className="mt-6 max-w-3xl text-headline font-display tracking-tight text-bone">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-6 max-w-2xl text-lede text-mist/80">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
