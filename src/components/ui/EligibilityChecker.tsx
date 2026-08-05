"use client";

import { useState } from "react";
import type { EligibilityConfig } from "@/lib/forms";
import { cn } from "@/lib/utils";

type EligibilityCheckerProps = {
  config: EligibilityConfig;
};

/**
 * Short interactive pre-application check. Any answer matching a
 * `disqualifier` marks the applicant as "needs preparation"; otherwise the
 * result is a pass with a call-to-action into the matching funnel.
 */
export function EligibilityChecker({ config }: EligibilityCheckerProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const answeredAll = Object.keys(answers).length === config.questions.length;
  const passed =
    answeredAll &&
    !config.questions.some(
      (q, i) => q.disqualifiers?.includes(answers[i] ?? ""),
    );

  return (
    <div className="glass rounded-[var(--radius-lg)] p-7 sm:p-9">
      <p className="eyebrow">{config.headline}</p>
      <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-mist">
        {config.intro}
      </p>

      <div className="mt-8 space-y-8">
        {config.questions.map((q, i) => (
          <div key={i}>
            <p className="text-sm font-medium tracking-tight text-bone">
              {i + 1}. {q.q}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {q.options.map((o) => {
                const active = answers[i] === o;
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [i]: o }));
                      setChecked(false);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm tracking-tight transition-colors duration-300",
                      active
                        ? "border-gold bg-gold text-white"
                        : "border-mist/25 text-mist hover:border-gold/60 hover:text-bone",
                    )}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={!answeredAll}
        onClick={() => setChecked(true)}
        className="mt-9 rounded-full bg-gold px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone disabled:pointer-events-none disabled:opacity-40"
      >
        Check my eligibility
      </button>

      {checked && (
        <div
          className={cn(
            "mt-6 rounded-[var(--radius-sm)] border p-6",
            passed ? "border-verdant/40 bg-verdant/10" : "border-amber/40 bg-amber/10",
          )}
        >
          <h3 className="font-display text-xl">
            {passed ? config.pass.title : config.fail.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            {passed ? config.pass.copy : config.fail.copy}
          </p>
        </div>
      )}
    </div>
  );
}
