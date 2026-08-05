"use client";

import { useState } from "react";
import type { Faq } from "@/lib/services-data";
import { cn } from "@/lib/utils";

type FaqProps = {
  faqs: Faq[];
  className?: string;
};

/** Accessible accordion for the FAQ blocks on every service page. */
export function Faq({ faqs, className }: FaqProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-mist/15 border-y border-mist/15", className)}>
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl tracking-tight text-bone">
                {faq.q}
              </span>
              <span
                aria-hidden
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300",
                  isOpen
                    ? "border-gold bg-gold text-white"
                    : "border-mist/25 text-mist",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={cn("size-4 transition-transform duration-300", isOpen && "rotate-45")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-500 ease-out",
                isOpen ? "grid-rows-[1fr] pb-7 opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl text-[0.95rem] leading-relaxed text-mist">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
