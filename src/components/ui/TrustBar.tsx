import { cn } from "@/lib/utils";
import type { TrustMark } from "@/lib/services-data";

type TrustBarProps = {
  items: TrustMark[];
  className?: string;
};

/** Row of compact trust signals (years, placements, success rates). */
export function TrustBar({ items, className }: TrustBarProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-mist/15 bg-mist/15 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.name} className="bg-ink-soft/80 px-6 py-7 text-center">
          <dd className="font-display text-2xl tracking-tight text-gold sm:text-3xl">
            {item.name}
          </dd>
          <dt className="mt-2 text-xs uppercase tracking-[0.15em] text-mist">
            {item.note}
          </dt>
        </div>
      ))}
    </dl>
  );
}
