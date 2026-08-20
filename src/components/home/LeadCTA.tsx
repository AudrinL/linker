"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "@/lib/content";
import { site } from "@/lib/site";
import { cn, whatsappLink } from "@/lib/utils";
import { recordInquiry } from "@/lib/submit";

/**
 * The closing frame, and the only place on the page a visitor can actually
 * convert without leaving it.
 *
 * Every call to action on the old home page was a link elsewhere — to
 * /contact, or out to WhatsApp — so a visitor who had just been persuaded had
 * to start again on another screen. This asks for three fields at the point
 * of persuasion.
 *
 * Three is the whole design. The /contact form asks for five and requires a
 * paragraph of prose, which is right for someone who arrived intending to
 * write one and wrong as a first contact: a name, a number to call back, and
 * which service. Anything else can be asked on the phone.
 *
 * The hand-off matches the main inquiry form deliberately — the record is
 * posted for the staff dashboard, then WhatsApp opens with the message ready,
 * because WhatsApp is where the client's team already works and that route
 * must still succeed if the API is down.
 */

/** Maps a service slug to the wording the contact form already uses. */
const SERVICE_LABEL: Record<string, string> = {
  recruitment: "Overseas jobs & recruitment",
  "study-abroad": "Study abroad",
  "visa-services": "Visa application",
  "travel-services": "Flights & hotels",
};

type Errors = Partial<Record<"name" | "phone" | "service", string>>;

export default function LeadCTA() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
    website: "",
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
    if (values.phone.trim().length < 7)
      next.phone = "Add a number we can reach you on.";
    if (!values.service) next.service = "Choose what you need help with.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* The message is optional here, so compose one when it is blank — the API
     requires a body, and "call me back about X" is what blank means. */
  const body = () =>
    values.message.trim() ||
    `Please call me back about ${values.service.toLowerCase()}.`;

  const composed = () =>
    [
      `Hello ${site.name},`,
      "",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Service: ${values.service}`,
      "",
      body(),
    ].join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Not awaited: the WhatsApp hand-off must not depend on the API being up.
    void recordInquiry({
      name: values.name,
      email: "",
      phone: values.phone,
      service: values.service,
      message: body(),
      source:
        typeof window !== "undefined" ? window.location.pathname : undefined,
      website: values.website,
    });

    window.open(whatsappLink(site.whatsapp, composed()), "_blank", "noopener");
    setSent(true);
  };

  const field =
    "w-full rounded-[var(--radius-sm)] border border-mist/20 bg-abyss px-5 py-3.5 text-[0.95rem] text-bone placeholder:text-muted/70 transition-colors duration-200 focus:border-gold/60 focus:bg-white focus:outline-none";

  return (
    <section id="start" className="bg-ink-soft py-20 sm:py-28">
      <div className="shell">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* The pitch, and the routes for anyone who would rather not fill
              anything in at all. */}
          <div className="rise">
            <div className="flex items-center gap-3.5">
              <span className="h-px w-10 shrink-0 bg-gold/70" />
              <span className="eyebrow">Let&apos;s begin</span>
            </div>

            <h2 className="mt-6 text-headline font-display">
              Tell us where you
              <br />
              want to <em className="italic text-gradient-warm">end up.</em>
            </h2>

            <p className="mt-6 max-w-md text-lede text-muted">
              One conversation is usually enough to know whether we can help,
              and we will tell you honestly if we cannot. No fee to ask.
            </p>

            <div className="mt-10 border-t border-mist/15 pt-8">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted">
                Or call us directly
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {site.phones.map((p) => (
                  <a
                    key={p.e164}
                    href={`tel:+${p.e164}`}
                    className="font-display text-[clamp(1.35rem,2.2vw,1.7rem)] tracking-tight text-bone transition-colors duration-200 hover:text-gold"
                  >
                    {p.display}
                  </a>
                ))}
              </div>
              <p className="mt-4 text-[0.85rem] leading-relaxed text-muted">
                {site.hours}
              </p>
            </div>
          </div>

          {/* The form */}
          <div className="rise">
            {sent ? (
              <div className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink p-9 text-center sm:p-12">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-gold/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-7 stroke-gold"
                    fill="none"
                    strokeWidth="1.8"
                    aria-hidden
                  >
                    <path
                      d="M4 12.5l5 5L20 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 font-display text-2xl">
                  We have your details
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted">
                  WhatsApp should be opening with your message ready to send. If
                  it did not, we still have your request and a consultant will
                  call you on {values.phone}.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <a
                    href={whatsappLink(site.whatsapp, composed())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bone"
                  >
                    Open WhatsApp again
                  </a>
                  <button
                    onClick={() => setSent(false)}
                    className="rounded-full border border-mist/25 px-6 py-3 text-sm font-medium transition-colors hover:border-gold/70 hover:text-gold"
                  >
                    Edit my details
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink p-7 shadow-[0_24px_70px_-40px_rgba(11,42,63,0.5)] sm:p-9"
              >
                <p className="font-display text-xl tracking-tight text-bone">
                  Request a free call back
                </p>
                <p className="mt-2 text-[0.88rem] text-muted">
                  Three details is all we need to get started.
                </p>

                <div className="mt-7 grid gap-5">
                  <div>
                    <label htmlFor="lead-name" className="eyebrow font-sans">
                      Your name
                    </label>
                    <input
                      id="lead-name"
                      value={values.name}
                      onChange={(e) => set("name")(e.target.value)}
                      placeholder="Full name"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      className={cn(
                        field,
                        "mt-3",
                        errors.name && "border-ember/70",
                      )}
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-ember">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="eyebrow font-sans">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                      placeholder="+250 …"
                      aria-invalid={!!errors.phone}
                      className={cn(
                        field,
                        "mt-3",
                        errors.phone && "border-ember/70",
                      )}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-ember">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-service" className="eyebrow font-sans">
                      What do you need?
                    </label>
                    <select
                      id="lead-service"
                      value={values.service}
                      onChange={(e) => set("service")(e.target.value)}
                      aria-invalid={!!errors.service}
                      className={cn(
                        field,
                        "mt-3 appearance-none",
                        !values.service && "text-muted/70",
                        errors.service && "border-ember/70",
                      )}
                    >
                      <option value="">Choose a service…</option>
                      {services.map((s) => (
                        <option key={s.slug} value={SERVICE_LABEL[s.slug]}>
                          {SERVICE_LABEL[s.slug]}
                        </option>
                      ))}
                      <option value="Something else">Something else</option>
                    </select>
                    {errors.service && (
                      <p className="mt-2 text-xs text-ember">{errors.service}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-message" className="eyebrow font-sans">
                      Anything else{" "}
                      <span className="font-normal normal-case tracking-normal text-muted">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="lead-message"
                      rows={3}
                      value={values.message}
                      onChange={(e) => set("message")(e.target.value)}
                      placeholder="Where you want to go, and roughly when."
                      className={cn(field, "mt-3 resize-y")}
                    />
                  </div>

                  {/* Honeypot. Never shown, never focusable. */}
                  <div aria-hidden className="hidden">
                    <label htmlFor="lead-website">Website</label>
                    <input
                      id="lead-website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={(e) => set("website")(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-7 w-full rounded-full bg-gold px-8 py-4 text-[0.95rem] font-semibold tracking-tight text-white shadow-[0_14px_40px_-14px_rgba(189,74,8,0.6)] transition-colors duration-300 hover:bg-bone"
                >
                  Request my free call back
                </button>

                <p className="mt-4 text-center text-xs leading-relaxed text-muted">
                  No fee to enquire. We reply within one working day.{" "}
                  <Link
                    href="/contact"
                    className="underline decoration-mist/40 underline-offset-2 transition-colors hover:text-gold"
                  >
                    Prefer email?
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
