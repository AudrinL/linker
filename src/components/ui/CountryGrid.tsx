import type { Country } from "@/lib/services-data";
import { cn } from "@/lib/utils";

type CountryGridProps = {
  countries: Country[];
  className?: string;
};

/** Cards for the countries each service covers. */
export function CountryGrid({ countries, className }: CountryGridProps) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {countries.map((country) => (
        <div
          key={country.name}
          className="group flex flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7 transition-all duration-500 hover:border-gold/40 hover:bg-gold/[0.04]"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl tracking-tight text-bone">
              {country.name}
            </h3>
            <span className="shrink-0 rounded-full bg-mist/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-mist">
              {country.region}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium tracking-tight text-gold">
            {country.roles}
          </p>
          <ul className="mt-4 flex-1 space-y-2">
            {country.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm leading-relaxed text-mist">
                <svg viewBox="0 0 24 24" className="mt-1 size-3.5 shrink-0 stroke-gold" fill="none" strokeWidth="2.4" aria-hidden>
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-mist/10 pt-4">
            <span className="text-[0.65rem] uppercase tracking-[0.15em] text-mist">Did you know</span>
            {country.facts.map((f) => (
              <p key={f} className="mt-1.5 text-xs leading-relaxed text-bone/80">
                {f}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
