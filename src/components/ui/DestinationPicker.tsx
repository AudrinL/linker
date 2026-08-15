import Link from "next/link";
import type { Destination } from "@/lib/countries";
import { cn } from "@/lib/utils";

type DestinationPickerProps = {
  destinations: Destination[];
  /** Each tile links here with the country pre-selected in the query string. */
  href: string;
  className?: string;
};

/**
 * The "where do you want to go?" grid.
 *
 * A country is the first decision an applicant makes, so this sits high on
 * every service page and carries the choice straight into the application via
 * `?country=` rather than making them pick twice.
 */
export function DestinationPicker({ destinations, href, className }: DestinationPickerProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {destinations.map((d) => (
        <Link
          key={d.name}
          href={`${href}?country=${encodeURIComponent(d.name)}`}
          className="group flex items-center gap-3 rounded-[var(--radius-sm)] border border-mist/15 bg-ink-soft/50 px-4 py-3.5 transition-all duration-400 hover:-translate-y-0.5 hover:border-gold/45 hover:bg-gold/[0.05]"
        >
          <span aria-hidden className="text-xl leading-none">
            {d.flag}
          </span>
          <span className="text-sm font-medium tracking-tight text-bone transition-colors duration-300 group-hover:text-gold">
            {d.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
