"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoItem {
  title: string;
  description: string;
  className?: string;
  image?: string;
  /** @deprecated use `image` instead */
  imagePlaceholder?: string;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]", className)}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className={cn(
            "relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] border border-mist/10 bg-bone/5 p-7",
            item.className
          )}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              quality={82}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-mist/8 to-mist/3" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bone/75 via-bone/25 to-transparent" />
          <div className="relative z-10">
            <h3 className="font-display text-2xl tracking-tight text-white">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/70">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
