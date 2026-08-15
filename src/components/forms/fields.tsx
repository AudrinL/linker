"use client";

import { cn } from "@/lib/utils";
import type { FieldDef } from "@/lib/forms";

export const inputCls =
  "w-full rounded-[var(--radius-sm)] border border-mist/18 bg-white px-5 py-3.5 text-[0.95rem] text-bone placeholder:text-muted/70 transition-colors duration-300 focus:border-gold/60 focus:outline-none";

export const labelCls = "eyebrow font-sans";

export const errorCls = "mt-2 text-xs text-ember";

export const hintCls = "mt-2 text-xs leading-relaxed text-muted";

/** Multi-select values are stored as one delimited string. */
export const MULTI_SEP = " · ";
export const splitMulti = (v: string) =>
  v ? v.split(MULTI_SEP).filter(Boolean) : [];

/** Validate a single field value against its definition. */
export function validateField(def: FieldDef, value: string): string | null {
  const v = value.trim();
  if (def.type === "checkbox")
    return def.required && v !== "on" ? "Please tick this to continue." : null;
  if (def.required && !v) {
    if (def.type === "multiselect") return "Choose at least one option.";
    return "This field is required.";
  }
  if (v) {
    if (def.type === "email" && !/^\S+@\S+\.\S{2,}$/.test(v))
      return "That email address does not look right.";
    if (def.type === "tel" && !/^[+\d][\d\s()-]{6,}$/.test(v))
      return "Add a phone number we can reach you on.";
    if (def.type === "text" && v.length < 2) return "A little more detail helps.";
    if (def.type === "multiselect" && def.max && splitMulti(v).length > def.max)
      return `Please choose no more than ${def.max}.`;
  }
  return null;
}

type FieldProps = {
  def: FieldDef;
  value: string;
  error?: string | null;
  onChange: (name: string, value: string) => void;
};

function SelectControl({
  def,
  value,
  onChange,
  hasError,
}: {
  def: Extract<FieldDef, { type: "select" }>;
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
}) {
  return (
    <select
      id={def.name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={!!hasError}
      className={cn(
        inputCls,
        "appearance-none bg-ink",
        !value && "text-muted/70",
        hasError && "border-ember/70",
      )}
    >
      <option value="">Choose…</option>
      {def.options.map((o) => (
        <option key={o} value={o} className="bg-ink text-bone">
          {o}
        </option>
      ))}
    </select>
  );
}

export function Field({ def, value, error, onChange }: FieldProps) {
  const handle = (v: string) => onChange(def.name, v);
  const hasError = !!error;

  switch (def.type) {
    case "select":
      return (
        <div>
          <label htmlFor={def.name} className={labelCls}>
            {def.label}
          </label>
          <div className="relative mt-3">
            <SelectControl def={def} value={value} onChange={handle} hasError={hasError} />
            <svg
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>
          {error && <p className={errorCls}>{error}</p>}
        </div>
      );

    case "radio":
      return (
        <div>
          <span className={labelCls}>{def.label}</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {def.options.map((o) => {
              const active = value === o;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => handle(o)}
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
          {error && <p className={errorCls}>{error}</p>}
        </div>
      );

    case "checkbox":
      return (
        <div>
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border bg-white px-5 py-4 transition-colors duration-300",
              hasError ? "border-ember/70" : "border-mist/18 hover:border-gold/50",
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={value === "on"}
              onChange={(e) => handle(e.target.checked ? "on" : "")}
              aria-invalid={hasError}
            />
            <span
              aria-hidden
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors duration-300",
                value === "on" ? "border-gold bg-gold text-white" : "border-mist/40 bg-white text-transparent",
              )}
            >
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[0.95rem] leading-snug text-bone">{def.label}</span>
          </label>
          {error && <p className={errorCls}>{error}</p>}
        </div>
      );

    case "date":
      return (
        <div>
          <label htmlFor={def.name} className={labelCls}>
            {def.label}
          </label>
          <input
            id={def.name}
            type="date"
            value={value}
            onChange={(e) => handle(e.target.value)}
            aria-invalid={hasError}
            className={cn(inputCls, "mt-3", !value && "text-muted/70", hasError && "border-ember/70")}
          />
          {def.hint && !error && <p className={hintCls}>{def.hint}</p>}
          {error && <p className={errorCls}>{error}</p>}
        </div>
      );

    case "search": {
      const listId = `${def.name}-options`;
      return (
        <div>
          <label htmlFor={def.name} className={labelCls}>
            {def.label}
          </label>
          <div className="relative mt-3">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="M13.5 13.5L17 17" strokeLinecap="round" />
            </svg>
            <input
              id={def.name}
              list={listId}
              value={value}
              onChange={(e) => handle(e.target.value)}
              placeholder={def.placeholder ?? "Search or type to select…"}
              autoComplete="off"
              aria-invalid={hasError}
              className={cn(inputCls, "pl-11", hasError && "border-ember/70")}
            />
            <datalist id={listId}>
              {def.options.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </div>
          {def.hint && !error && <p className={hintCls}>{def.hint}</p>}
          {error && <p className={errorCls}>{error}</p>}
        </div>
      );
    }

    case "multiselect": {
      const picked = splitMulti(value);
      const atLimit = !!def.max && picked.length >= def.max;
      const toggle = (o: string) => {
        const next = picked.includes(o)
          ? picked.filter((p) => p !== o)
          : atLimit
            ? picked
            : [...picked, o];
        handle(next.join(MULTI_SEP));
      };
      return (
        <div>
          <span className={labelCls}>{def.label}</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {def.options.map((o) => {
              const active = picked.includes(o);
              const locked = atLimit && !active;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggle(o)}
                  aria-pressed={active}
                  disabled={locked}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm tracking-tight transition-colors duration-300",
                    active
                      ? "border-gold bg-gold text-white"
                      : locked
                        ? "cursor-not-allowed border-mist/15 text-mist/40"
                        : "border-mist/25 text-mist hover:border-gold/60 hover:text-bone",
                  )}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {def.max && !error && (
            <p className={hintCls}>
              {def.hint ? `${def.hint} · ` : ""}
              {picked.length} of {def.max} selected
            </p>
          )}
          {def.hint && !def.max && !error && <p className={hintCls}>{def.hint}</p>}
          {error && <p className={errorCls}>{error}</p>}
        </div>
      );
    }

    case "textarea":
      return (
        <div>
          <label htmlFor={def.name} className={labelCls}>
            {def.label}
          </label>
          <textarea
            id={def.name}
            rows={def.rows ?? 4}
            value={value}
            onChange={(e) => handle(e.target.value)}
            placeholder={def.placeholder}
            aria-invalid={hasError}
            className={cn(inputCls, "mt-3 resize-y", hasError && "border-ember/70")}
          />
          {error && <p className={errorCls}>{error}</p>}
        </div>
      );

    default:
      return (
        <div>
          <label htmlFor={def.name} className={labelCls}>
            {def.label}
          </label>
          <input
            id={def.name}
            type={def.type}
            inputMode={def.type === "email" ? "email" : def.type === "tel" ? "tel" : undefined}
            value={value}
            onChange={(e) => handle(e.target.value)}
            placeholder={def.placeholder}
            aria-invalid={hasError}
            className={cn(inputCls, "mt-3", hasError && "border-ember/70")}
          />
          {error && <p className={errorCls}>{error}</p>}
        </div>
      );
  }
}
