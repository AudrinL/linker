"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoItem {
  title: string;
  description: string;
  className?: string;
  imagePlaceholder?: string;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]", className)}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className={cn(
            "relative flex flex-col justify-end overflow-hidden rounded-3xl border border-mist/10 bg-mist/5 p-6",
            item.className
          )}
        >
          {item.imagePlaceholder && (
            <div className="absolute inset-0 z-0 bg-mist/5 flex items-center justify-center opacity-50">
              <span className="text-xs uppercase tracking-widest text-mist">{item.imagePlaceholder} Image</span>
            </div>
          )}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-abyss/90 via-abyss/40 to-transparent" />
          <div className="relative z-20">
            <h3 className="font-display text-2xl text-bone">{item.title}</h3>
            <p className="mt-2 text-sm text-mist">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
