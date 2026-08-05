import Link from "next/link";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  index: string;
  title: string;
  description: string;
  href: string;
  points: string[];
  className?: string;
};

/** Numbered feature card used on the group landing hubs. */
export function ServiceCard({ index, title, description, href, points, className }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/[0.04]",
        className,
      )}
    >
      <span className="font-display text-5xl text-gold/25 transition-colors duration-500 group-hover:text-gold/50">
        {index}
      </span>
      <h3 className="mt-4 font-display text-2xl tracking-tight text-bone">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-mist">{description}</p>
      <ul className="mt-5 flex-1 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-bone/80">
            <svg viewBox="0 0 24 24" className="mt-1 size-3.5 shrink-0 stroke-gold" fill="none" strokeWidth="2.4" aria-hidden>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {p}
          </li>
        ))}
      </ul>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold">
        Explore
        <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
