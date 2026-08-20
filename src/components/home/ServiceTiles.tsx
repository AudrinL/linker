import Link from "next/link";
import { services } from "@/lib/content";

/**
 * The four doors into the business.
 *
 * Visitors arrive already knowing which of these they want, so this is the
 * only decision the page asks for and it sits immediately under the hero.
 *
 * This used to be one of *two* service listings — a tile grid here and a
 * stack of four full-height photographic panels further down, both mapping
 * the same array. The panels cost four screens of scrolling and four
 * multi-megabyte plates to repeat what these tiles already say, so the tiles
 * absorbed the one thing the panels added: the bullet points. Nothing that
 * was on the page is gone, it is just no longer said twice.
 */
export default function ServiceTiles() {
  return (
    <section id="services" className="shell py-20 sm:py-28">
      <div className="rise flex items-center gap-3.5">
        <span className="h-px w-10 shrink-0 bg-gold/70" />
        <span className="eyebrow">What do you need?</span>
      </div>

      <h2 className="rise mt-6 max-w-2xl text-headline font-display">
        Four services.{" "}
        <em className="italic text-gradient-cool">One team</em> behind them.
      </h2>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={s.href}
            className="rise group flex flex-col rounded-[var(--radius-lg)] border border-mist/15 bg-ink p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_18px_50px_-24px_rgba(11,42,63,0.35)] sm:p-8"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs tracking-[0.2em] text-gold">
                {s.index}
              </span>
              <h3 className="font-display text-2xl tracking-tight text-bone">
                {s.label}
              </h3>
            </div>

            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
              {s.summary}
            </p>

            {/* Carried over from the panel stack this section replaced — the
                detail that turns a label into a reason to click. */}
            <ul className="mt-5 flex-1 space-y-2.5">
              {s.points.slice(0, 3).map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-[0.88rem] leading-snug text-mist"
                >
                  <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-gold/70" />
                  {p}
                </li>
              ))}
            </ul>

            <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold">
              {s.label === "Work Abroad" ? "See open roles" : "Learn more"}
              <svg
                viewBox="0 0 24 24"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      <p className="rise mt-8 text-center text-[0.95rem] text-muted">
        Not sure which applies to you?{" "}
        <Link
          href="#start"
          className="font-semibold text-gold underline decoration-gold/35 underline-offset-4 transition-colors hover:text-bone"
        >
          Ask us — it costs nothing to find out.
        </Link>
      </p>
    </section>
  );
}
