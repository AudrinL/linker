import { stats } from "@/lib/content";
import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";

/**
 * Quiet credibility. Four numbers, generous space, no chrome around them —
 * the restraint is what makes them read as fact rather than marketing.
 */
export default function Proof() {
  return (
    <section className="relative overflow-hidden bg-abyss py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "url(/img/texture-routes.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="shell relative">
        <Reveal className="max-w-2xl">
          <div className="flex items-center gap-3.5">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="eyebrow">By the numbers</span>
          </div>
          <h2 className="mt-7 text-title font-display">
            Eleven years of getting people
            <em className="italic text-gradient-warm"> where they meant to go.</em>
          </h2>
        </Reveal>

        <dl className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-t border-mist/15 pt-6">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter
                    to={s.value}
                    suffix={s.suffix}
                    className="block font-display text-[clamp(3rem,6vw,4.75rem)] leading-none tracking-tight text-bone"
                  />
                  <span className="mt-4 block max-w-[14rem] text-[0.9rem] leading-snug text-muted">
                    {s.label}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
