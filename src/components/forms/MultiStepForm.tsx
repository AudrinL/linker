"use client";

import { useMemo, useState } from "react";
import { site } from "@/lib/site";
import type { FormConfig } from "@/lib/forms";
import { cn, mailtoLink, whatsappLink } from "@/lib/utils";
import { Field, validateField } from "./fields";
import FileUpload from "./FileUpload";

type Values = Record<string, string>;
type Files = Record<string, File | null>;

function makeRef(config: FormConfig) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const service = config.id
    .split("-")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return `LWT-${service}-${stamp}`;
}

function makeReference(config: FormConfig) {
  const ref = makeRef(config);
  try {
    const list = JSON.parse(localStorage.getItem("lwt-applications") ?? "[]");
    list.push({
      ref,
      service: config.id,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem("lwt-applications", JSON.stringify(list));
  } catch {
    /* storage unavailable — the handoff still works */
  }
  return ref;
}

type Props = { config: FormConfig };

/**
 * One engine for every application funnel.
 *
 * Renders the config's sections as steps, then a documents step (in-memory
 * files), then a review step, then hands the composed summary off to WhatsApp
 * with email as a fallback — matching the existing InquiryForm pattern. When a
 * FastAPI backend lands (BACKEND_PLAN.md) this is the single submission hook.
 */
export default function MultiStepForm({ config }: Props) {
  const steps = useMemo(
    () => [...config.sections.map((s) => s.title), "Documents", "Review"],
    [config],
  );

  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [files, setFiles] = useState<Files>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tried, setTried] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const isLast = current === steps.length - 1;
  const progress = (current / (steps.length - 1)) * 100;

  const setValue = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const setFile = (id: string) => (file: File | null) => {
    setFiles((f) => ({ ...f, [id]: file }));
    setErrors((e) => ({ ...e, [`file:${id}`]: "" }));
  };

  const validateStep = (): boolean => {
    const next: Record<string, string> = {};
    if (current < config.sections.length) {
      for (const field of config.sections[current].fields) {
        const err = validateField(field, values[field.name] ?? "");
        if (err) next[field.name] = err;
      }
    } else if (current === config.sections.length) {
      for (const doc of config.documents) {
        if (doc.required && !files[doc.id])
          next[`file:${doc.id}`] = `Please add your ${doc.label.toLowerCase()}.`;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const composed = (ref: string) => {
    const lines: string[] = [
      `Hello ${site.name},`,
      `${config.whatsappIntro} — Ref ${ref}`,
      "",
    ];
    for (const section of config.sections) {
      const rows = section.fields
        .map((f) => (values[f.name] ? `• ${f.label}: ${values[f.name]}` : null))
        .filter(Boolean);
      if (rows.length) {
        lines.push(section.title, ...rows, "");
      }
    }
    const docs = config.documents
      .filter((d) => files[d.id])
      .map((d) => `• ${d.label}`);
    if (docs.length) lines.push("Documents (uploading separately)", ...docs, "");
    return lines.join("\n");
  };

  const submit = () => {
    if (!validateStep()) return;
    const ref = makeReference(config);
    const msg = composed(ref);
    window.open(whatsappLink(site.whatsapp, msg), "_blank", "noopener");
    setReference(ref);
  };

  const next = () => {
    if (!validateStep()) {
      setTried(true);
      return;
    }
    setTried(false);
    setCurrent((c) => Math.min(c + 1, steps.length - 1));
  };

  const back = () => setCurrent((c) => Math.max(c - 1, 0));

  /* ---------------- success screen ---------------- */

  if (reference) {
    const msg = composed(reference);
    const visibleDocs = config.documents.filter((d) => files[d.id]);
    return (
      <div className="glass rounded-[var(--radius-lg)] p-9 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-gold/15">
          <svg
            viewBox="0 0 24 24"
            className="size-7 stroke-gold"
            fill="none"
            strokeWidth="1.7"
            aria-hidden
          >
            <path d="M4 12.5l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-6 font-display text-2xl">WhatsApp is opening</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted">
          Your application summary is ready in WhatsApp with reference{" "}
          <span className="font-medium text-bone">{reference}</span>. Keep the
          number — we use it on every reply.
        </p>
        <div className="mx-auto mt-6 grid max-w-lg gap-3 text-left sm:grid-cols-2">
          {visibleDocs.length > 0 && (
            <div className="rounded-[var(--radius-sm)] border border-mist/15 bg-ink-soft/60 p-4 sm:col-span-2">
              <p className="eyebrow font-sans">Documents to send</p>
              <ul className="mt-2 space-y-1 text-sm text-bone">
                {visibleDocs.map((d) => (
                  <li key={d.id}>• {d.label} — {files[d.id]?.name}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                We'll ask you to send these over in the chat, or upload them to
                the private link we send after.
              </p>
            </div>
          )}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappLink(site.whatsapp, msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bone"
          >
            Open WhatsApp again
          </a>
          <a
            href={mailtoLink(site.email, `${config.emailSubject} — ${reference}`, msg)}
            className="rounded-full border border-mist/25 px-6 py-3 text-sm font-medium transition-colors hover:border-gold/70 hover:text-gold"
          >
            Send it by email instead
          </a>
        </div>
        <button
          onClick={() => setReference(null)}
          className="mt-6 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
        >
          Edit my details
        </button>
      </div>
    );
  }

  /* ---------------- step rail ---------------- */

  const rail = (
    <ol className="flex items-center gap-2" aria-label="Application progress">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "now" : "todo";
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled={i > current}
              onClick={() => i < current && setCurrent(i)}
              aria-current={state === "now" ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full transition-colors duration-300",
                i > current && "cursor-not-allowed",
                i < current && "hover:opacity-80",
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-medium transition-colors duration-300",
                  state === "done" && "border-gold bg-gold text-white",
                  state === "now" && "border-gold/60 bg-gold/10 text-gold",
                  state === "todo" && "border-mist/30 text-mist",
                )}
              >
                {state === "done" ? (
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "hidden whitespace-nowrap text-xs font-medium tracking-tight lg:block",
                  state === "now" ? "text-bone" : state === "done" ? "text-gold" : "text-mist",
                )}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span aria-hidden className="h-px flex-1 bg-mist/20" />
            )}
          </li>
        );
      })}
    </ol>
  );

  /* ---------------- form body ---------------- */

  const isSectionStep = current < config.sections.length;
  const isDocsStep = current === config.sections.length;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        isLast ? submit() : next();
      }}
      noValidate
      className="glass rounded-[var(--radius-lg)] p-7 sm:p-9"
    >
      <div className="mx-auto mb-8 w-full max-w-2xl">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="font-display text-xl">{steps[current]}</h3>
          <span className="text-xs text-muted">
            Step {current + 1} of {steps.length}
          </span>
        </div>
        <div className="relative h-1 overflow-hidden rounded-full bg-mist/15">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-5 hidden sm:block">{rail}</div>
      </div>

      {isSectionStep && (
        <div className="grid gap-6 sm:grid-cols-2">
          {config.sections[current].fields.map((field) => (
            <div
              key={field.name}
              className={cn(field.type === "radio" || field.type === "textarea" || field.type === "checkbox" ? "sm:col-span-2" : "")}
            >
              <Field
                def={field}
                value={values[field.name] ?? ""}
                error={tried ? errors[field.name] : null}
                onChange={setValue}
              />
            </div>
          ))}
        </div>
      )}

      {isDocsStep && (
        <div className="grid gap-7">
          <p className="text-sm leading-relaxed text-muted">
            Add the documents below. They stay on your device — we only ask you
            to share them after we have replied, via a private link or WhatsApp.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {config.documents.map((doc) => (
              <div key={doc.id} className="sm:col-span-1">
                <FileUpload
                  def={doc}
                  value={files[doc.id] ?? null}
                  error={tried ? errors[`file:${doc.id}`] : null}
                  onChange={setFile(doc.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {isLast && (
        <div className="rounded-[var(--radius-sm)] border border-mist/15 bg-ink-soft/50 p-6">
          <p className="eyebrow font-sans">Check your answers</p>
          <div className="mt-4 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {config.sections.flatMap((s) =>
              s.fields.map((f) =>
                values[f.name] ? (
                  <div key={f.name} className="text-sm">
                    <span className="block text-xs uppercase tracking-wider text-mist">{f.label}</span>
                    <span className="mt-0.5 block font-medium tracking-tight text-bone">{values[f.name]}</span>
                  </div>
                ) : null,
              ),
            )}
          </div>
          {config.documents.some((d) => files[d.id]) && (
            <div className="mt-5 border-t border-mist/15 pt-4">
              <span className="text-xs uppercase tracking-wider text-mist">Documents</span>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {config.documents
                  .filter((d) => files[d.id])
                  .map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-sm text-bone">
                      <svg viewBox="0 0 24 24" className="size-4 shrink-0 stroke-verdant" fill="none" strokeWidth="2" aria-hidden>
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {d.label}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={back}
          disabled={current === 0}
          className="rounded-full border border-mist/25 px-6 py-3.5 text-sm font-medium transition-colors hover:border-gold/70 hover:text-gold disabled:pointer-events-none disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
        >
          {isLast ? config.submitLabel : "Continue →"}
        </button>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted">
        {config.subtitle}
      </p>
    </form>
  );
}
