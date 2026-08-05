import { cn } from "@/lib/utils";

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

/** Quote card for testimonial grids. */
export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/60 p-8",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-8 fill-gold/30" aria-hidden>
        <path d="M10 8c-3.3 0-6 2.7-6 6v4h6v-6H6.5C6.6 10 7.9 8.6 10 8.2zm10 0c-3.3 0-6 2.7-6 6v4h6v-6h-3.5c.1-1.4 1.4-2.8 3.5-3.2z" />
      </svg>
      <blockquote className="mt-4 flex-1 text-[0.98rem] leading-relaxed text-bone/90">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6 border-t border-mist/10 pt-5">
        <p className="text-sm font-medium tracking-tight text-bone">
          {testimonial.name}
        </p>
        <p className="mt-0.5 text-xs text-mist">{testimonial.detail}</p>
      </figcaption>
    </figure>
  );
}
