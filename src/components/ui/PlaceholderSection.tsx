"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PlaceholderSectionProps {
  title: string;
  description?: string;
  height?: string;
  className?: string;
}

export function PlaceholderSection({ 
  title, 
  description, 
  height = "min-h-[400px]",
  className 
}: PlaceholderSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-mist/20 bg-mist/5 p-8 text-center",
        height,
        className
      )}
    >
      <div className="rounded-full bg-mist/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-mist mb-4">
        Placeholder
      </div>
      <h3 className="font-display text-2xl text-bone lg:text-3xl">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-mist">{description}</p>
      )}
    </motion.div>
  );
}
