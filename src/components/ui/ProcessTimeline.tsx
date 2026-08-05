"use client";

import { motion } from "framer-motion";
import type { ProcessStep } from "@/lib/services-data";
import { cn } from "@/lib/utils";

type ProcessTimelineProps = {
  steps: ProcessStep[];
  className?: string;
};

/** Vertical numbered timeline with optional working-days chips. */
export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  return (
    <ol className={cn("relative", className)}>
      {steps.map((step, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="relative flex gap-6 pb-10 last:pb-0"
        >
          {i !== steps.length - 1 && (
            <span
              aria-hidden
              className="absolute left-5 top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-mist/25 to-transparent"
            />
          )}
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 font-display text-gold">
            {i + 1}
          </span>
          <div className="pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-xl tracking-tight text-bone">
                {step.title}
              </h3>
              {step.duration && (
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-[0.65rem] uppercase tracking-[0.15em] text-gold">
                  {step.duration}
                </span>
              )}
            </div>
            <p className="mt-2 max-w-xl leading-relaxed text-mist">
              {step.description}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
