import { steps } from "@/lib/content";

/**
 * What happens if you make contact.
 *
 * This replaces the scroll-scrubbed manifesto that sat here — a fine piece of
 * writing that answered a question nobody arrives with. The question visitors
 * do arrive with is "what will this cost me just to ask, and will I be sold
 * something that cannot work?". The manifesto's actual argument (we are
 * honest, we say no when the answer is no) is now made where it does some
 * good: as the three concrete steps between a first call and a departure.
 *
 * No photography. The old section carried a two-megabyte texture plate behind
 * its type; three numbered steps need none.
 */
export default function Steps() {
  return (
    <section className="relative overflow-hidden bg-bone py-20 sm:py-28">
      <div className="shell relative">
        <div className="rise flex items-center gap-3.5">
          <span className="h-px w-10 shrink-0 bg-amber/80" />
          <span className="eyebrow text-amber">How it works</span>
        </div>

        <h2 className="rise mt-6 max-w-2xl text-headline font-display text-white">
          Three steps, and the first one is free.
        </h2>

        <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <li key={step.n} className="rise border-t border-white/20 pt-6">
              <span className="font-mono text-xs tracking-[0.2em] text-amber">
                {step.n}
              </span>
              <h3 className="mt-4 font-display text-xl tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/70">
                {step.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
