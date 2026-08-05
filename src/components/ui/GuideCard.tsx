import type { Guide } from "@/lib/services-data";
import { cn } from "@/lib/utils";

type GuideCardProps = {
  guide: Guide;
  className?: string;
};

/** Card linking to a downloadable / printable PDF guide. */
export function GuideCard({ guide, className }: GuideCardProps) {
  return (
    <a
      href={guide.file}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-full flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/[0.04]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-gold/10 transition-colors duration-500 group-hover:bg-gold group-hover:text-white">
          <svg
            viewBox="0 0 24 24"
            className="size-6 stroke-gold transition-colors duration-500 group-hover:stroke-white"
            fill="none"
            strokeWidth="1.7"
            aria-hidden
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
            <path d="M14 2v6h6" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-xs uppercase tracking-[0.15em] text-mist">{guide.meta}</span>
      </div>
      <h3 className="mt-6 font-display text-xl tracking-tight text-bone">{guide.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{guide.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold">
        Read the guide
        <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
