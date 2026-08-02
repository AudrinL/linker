"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
}

interface ProcessStepsProps {
  steps: Step[];
  className?: string;
}

export function ProcessSteps({ steps, className }: ProcessStepsProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex gap-6"
        >
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-gold">
              {i + 1}
            </div>
            {i !== steps.length - 1 && (
              <div className="mt-4 w-px flex-1 bg-gradient-to-b from-mist/20 to-transparent" />
            )}
          </div>
          <div className="pb-8 pt-1">
            <h3 className="font-display text-xl text-bone">{step.title}</h3>
            <p className="mt-2 text-mist leading-relaxed">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
