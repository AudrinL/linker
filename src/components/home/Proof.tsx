import { stats, testimonials } from "@/lib/content";
import Counter from "@/components/motion/Counter";

/**
 * Credibility, in one section instead of three.
 *
 * These four numbers were previously rendered twice — once as a hero strip
 * and again here — and the client stories sat in a separate section below
 * with their own interactive roster, a state hook and a switcher for what is
 * currently two quotes. Numbers and testimonials are the same argument, so
 * they now make it together: the figures, then the person they happened to.
 *
 * The counter is the only JavaScript left in here, and it renders its final
 * value in the markup, so the numbers are right with the script blocked.
 */
export default function Proof() {
  const t = testimonials[0];

  return (
    <section className="shell py-20 sm:py-28">
      <div className="rise flex items-center gap-3.5">
        <span className="h-px w-10 shrink-0 bg-gold/70" />
        <span className="eyebrow">Eleven years of this</span>
      </div>

      <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rise flex flex-col-reverse border-t border-mist/15 pt-5"
          >
            <dt className="mt-3 max-w-[13rem] text-[0.88rem] leading-snug text-muted">
              {s.label}
            </dt>
            <dd>
              <Counter
                to={s.value}
                suffix={s.suffix}
                className="block font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight text-bone"
              />
            </dd>
          </div>
        ))}
      </dl>

      <figure className="rise mt-16 rounded-[var(--radius-lg)] border border-mist/15 bg-ink p-8 sm:p-12">
        <blockquote className="font-display text-[clamp(1.25rem,2.4vw,1.85rem)] leading-[1.34] tracking-[-0.015em] text-bone">
          <span className="text-gold">“</span>
          {t.quote}
          <span className="text-gold">”</span>
        </blockquote>
        <figcaption className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
          <cite className="not-italic text-[0.95rem] font-semibold tracking-tight text-bone">
            {t.name}
          </cite>
          <span className="text-mist/45">·</span>
          <span className="text-[0.9rem] text-muted">{t.role}</span>
          <span className="rounded-full border border-gold/35 px-3.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-gold">
            {t.service}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
