import { cn } from "@/lib/utils";

export type Feature = { title: string; description: string };

type FeatureListProps = {
  features: Feature[];
  /** Prefix each item with 01, 02, 03 … as the service pages do. */
  numbered?: boolean;
  columns?: 2 | 3;
  className?: string;
};

/**
 * A numbered list of what a service actually includes — the plain-language
 * inventory that sits between the page hero and the application form.
 */
export function FeatureList({ features, numbered = true, columns = 2, className }: FeatureListProps) {
  return (
    <div
      className={cn(
        "grid gap-x-8 gap-y-7",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
        className,
      )}
    >
      {features.map((f, i) => (
        <div
          key={f.title}
          className="border-t border-mist/15 pt-5 transition-colors duration-500 hover:border-gold/40"
        >
          {numbered && (
            <span className="font-display text-sm tracking-[0.1em] text-gold/60">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
          <h3 className="mt-2 font-display text-xl tracking-tight text-bone">
            {f.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-mist">{f.description}</p>
        </div>
      ))}
    </div>
  );
}

type ChecklistProps = {
  items: string[];
  columns?: 1 | 2 | 3;
  className?: string;
};

/** Tick-marked list for requirements, eligibility and inclusion lists. */
export function Checklist({ items, columns = 2, className }: ChecklistProps) {
  return (
    <ul
      className={cn(
        "grid gap-x-8 gap-y-3",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : columns === 2 ? "sm:grid-cols-2" : "",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-mist">
          <svg
            viewBox="0 0 24 24"
            className="mt-1 size-4 shrink-0 stroke-gold"
            fill="none"
            strokeWidth="2.2"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}
