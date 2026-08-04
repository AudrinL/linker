"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { cn, mailtoLink, whatsappLink } from "@/lib/utils";

const SERVICES = [
  "Overseas jobs & recruitment",
  "Visa application",
  "Flights & hotels",
  "Safari or tour booking",
  "Vehicle import or export",
  "Something else",
] as const;

type Errors = Partial<Record<"name" | "contact" | "service" | "message", string>>;

/**
 * Client inquiry form.
 *
 * There is no backend: the form validates, composes a readable message, and
 * hands off to WhatsApp — where the client's team already works — with an
 * email route as a fallback for anyone without it. Nothing is stored or sent
 * anywhere else, so there is no silent-failure path for a real inquiry.
 */
export default function InquiryForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof values) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Please tell us your name.";
    if (!values.email.trim() && !values.phone.trim())
      next.contact = "Add an email or a phone number so we can reply.";
    if (values.email.trim() && !/^\S+@\S+\.\S{2,}$/.test(values.email.trim()))
      next.contact = "That email address does not look right.";
    if (!values.service) next.service = "Choose what you need help with.";
    if (values.message.trim().length < 12)
      next.message = "A sentence or two about your plans helps us prepare.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const composed = () =>
    [
      `Hello ${site.name},`,
      "",
      `Name: ${values.name}`,
      values.email && `Email: ${values.email}`,
      values.phone && `Phone: ${values.phone}`,
      `Service: ${values.service}`,
      "",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    window.open(whatsappLink(site.whatsapp, composed()), "_blank", "noopener");
    setSent(true);
  };

  const field =
    "w-full rounded-[var(--radius-sm)] border border-mist/18 bg-bone/[0.04] px-5 py-4 text-[0.95rem] text-bone placeholder:text-muted/70 transition-colors duration-300 focus:border-gold/60 focus:bg-bone/[0.07] focus:outline-none";

  if (sent) {
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
        <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted">
          Your message is ready to send in WhatsApp. If the window did not open,
          use one of the routes below and we will pick it up either way.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappLink(site.whatsapp, composed())}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bone"
          >
            Open WhatsApp again
          </a>
          <a
            href={mailtoLink(
              site.email,
              `Inquiry — ${values.service}`,
              composed(),
            )}
            className="rounded-full border border-mist/25 px-6 py-3 text-sm font-medium transition-colors hover:border-gold/70 hover:text-gold"
          >
            Send it by email instead
          </a>
        </div>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
        >
          Edit my message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="glass rounded-[var(--radius-lg)] p-7 sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="eyebrow font-sans">
            Your name
          </label>
          <input
            id="name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder="Full name"
            aria-invalid={!!errors.name}
            className={cn(field, "mt-3", errors.name && "border-ember/70")}
          />
          {errors.name && (
            <p className="mt-2 text-xs text-ember">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="eyebrow font-sans">
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder="you@example.com"
            className={cn(field, "mt-3", errors.contact && "border-ember/70")}
          />
        </div>

        <div>
          <label htmlFor="phone" className="eyebrow font-sans">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
            placeholder="+250 …"
            className={cn(field, "mt-3", errors.contact && "border-ember/70")}
          />
        </div>

        {errors.contact && (
          <p className="-mt-2 text-xs text-ember sm:col-span-2">
            {errors.contact}
          </p>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="service" className="eyebrow font-sans">
            What do you need?
          </label>
          <select
            id="service"
            value={values.service}
            onChange={(e) => set("service")(e.target.value)}
            aria-invalid={!!errors.service}
            className={cn(
              field,
              "mt-3 appearance-none bg-ink",
              !values.service && "text-muted/70",
              errors.service && "border-ember/70",
            )}
          >
            <option value="">Choose a service…</option>
            {SERVICES.map((s) => (
              <option key={s} value={s} className="bg-ink text-bone">
                {s}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-2 text-xs text-ember">{errors.service}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="eyebrow font-sans">
            Tell us more
          </label>
          <textarea
            id="message"
            rows={5}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            placeholder="Where you want to go, when, and anything we should know."
            aria-invalid={!!errors.message}
            className={cn(
              field,
              "mt-3 resize-y",
              errors.message && "border-ember/70",
            )}
          />
          {errors.message && (
            <p className="mt-2 text-xs text-ember">{errors.message}</p>
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
        >
          Send via WhatsApp
        </button>
        <p className="text-xs leading-relaxed text-muted">
          Opens WhatsApp with your message ready.
          <br className="hidden sm:block" /> We usually reply within a few hours.
        </p>
      </div>
    </form>
  );
}
