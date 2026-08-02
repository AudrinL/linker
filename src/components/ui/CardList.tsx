"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  tags?: string[];
  description?: string;
}

interface CardListProps {
  items: CardItem[];
  className?: string;
}

export function CardList({ items, className }: CardListProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="group flex flex-col justify-between rounded-3xl border border-mist/10 bg-mist/5 p-6 transition-colors hover:border-gold/30 hover:bg-mist/10"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl text-bone">{item.title}</h3>
            </div>
            <p className="mt-1 text-sm font-medium text-gold">{item.subtitle}</p>
            {item.description && (
              <p className="mt-4 text-sm text-mist">{item.description}</p>
            )}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag, j) => (
                <span key={j} className="rounded-full bg-abyss/50 px-3 py-1 text-xs font-medium text-mist">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
