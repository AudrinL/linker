import Link from "next/link";
import type { PricingTier } from "@/lib/services-data";
import { cn } from "@/lib/utils";

type PricingGridProps = {
  tiers: PricingTier[];
  className?: string;
};

/** Three-tier pricing grid with a highlighted featured column. */
export function PricingGrid({ tiers, className }: PricingGridProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-3", className)}>
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "relative flex flex-col rounded-[var(--radius-lg)] border p-8",
            tier.featured
              ? "border-gold/50 bg-gold/[0.07] shadow-[0_20px_60px_-30px_rgba(180,83,9,0.35)]"
              : "border-mist/15 bg-ink-soft/60",
          )}
        >
          {tier.featured && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-white">
              Most popular
            </span>
          )}
          <h3 className="font-display text-xl text-bone">{tier.name}</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl tracking-tight text-gold">
              {tier.price}
            </span>
            {tier.note && (
              <span className="text-xs text-mist">{tier.note}</span>
            )}
          </div>
          <ul className="mt-6 flex-1 space-y-3">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm leading-relaxed text-bone">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 size-4 shrink-0 stroke-verdant"
                  fill="none"
                  strokeWidth="2.2"
                  aria-hidden
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={tier.href}
            className={cn(
              "mt-8 inline-flex justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors duration-500",
              tier.featured
                ? "bg-gold text-white hover:bg-bone"
                : "border border-gold/40 text-gold hover:bg-gold hover:text-white",
            )}
          >
            {tier.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
