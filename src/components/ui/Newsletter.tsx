"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { cn, whatsappLink } from "@/lib/utils";
import { recordSubscriber } from "@/lib/submit";
import { inputCls, labelCls, errorCls } from "@/components/forms/fields";

/**
 * Opportunity alerts sign-up.
 *
 * The address is stored via the API and appears under Subscribers in the staff
 * dashboard. The WhatsApp hand-off stays as well: it is what the team actually
 * watches, and it means a signup still lands if the API is down. There is no
 * sending platform behind this yet — the list is exported and used by hand —
 * so the confirmation copy promises only what happens.
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !whatsapp.trim()) {
      setError("Add an email address or a WhatsApp number so we can reach you.");
      return;
    }
    if (email.trim() && !/^\S+@\S+\.\S{2,}$/.test(email.trim())) {
      setError("That email address does not look right.");
      return;
    }
    if (!agreed) {
      setError("Please confirm you would like to receive opportunity updates.");
      return;
    }
    setError(null);
    const msg = [
      `Hello ${site.name},`,
      "Please add me to your opportunity updates.",
      "",
      email.trim() && `Email: ${email.trim()}`,
      whatsapp.trim() && `WhatsApp: ${whatsapp.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    if (email.trim()) void recordSubscriber(email.trim(), "opportunity-alerts");
    window.open(whatsappLink(site.whatsapp, msg), "_blank", "noopener");
    setSent(true);
  };

  if (sent) {
    return (
      <section className="rounded-[var(--radius-lg)] border border-gold/30 bg-gold/[0.05] p-8 text-center sm:p-10">
        <h2 className="font-display text-2xl tracking-tight text-bone">
          Almost there
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-mist">
          Send the message we opened in WhatsApp and our team will add you to
          the list. You will hear from us when new opportunities open in the
          markets you care about.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
        >
          Use a different contact
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-[var(--radius-lg)] border border-mist/15 bg-ink-soft/50 p-8 sm:p-10">
      <p className="eyebrow">Stay updated</p>
      <h2 className="mt-4 font-display text-3xl tracking-tight text-bone">
        Get notified when new opportunities open
      </h2>
      <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-mist">
        New vacancies and programs are added as employers and institutions
        confirm them. Leave a contact and we will tell you when something fits.
      </p>

      <form onSubmit={submit} noValidate className="mt-8 max-w-2xl">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nl-email" className={labelCls}>
              Email address
            </label>
            <input
              id="nl-email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="you@example.com"
              className={cn(inputCls, "mt-3")}
            />
          </div>
          <div>
            <label htmlFor="nl-whatsapp" className={labelCls}>
              WhatsApp number
            </label>
            <input
              id="nl-whatsapp"
              type="tel"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value);
                setError(null);
              }}
              placeholder="+250 7…"
              className={cn(inputCls, "mt-3")}
            />
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="sr-only"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setError(null);
            }}
          />
          <span
            aria-hidden
            className={cn(
              "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors duration-300",
              agreed
                ? "border-gold bg-gold text-white"
                : "border-mist/40 bg-white text-transparent",
            )}
          >
            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-sm leading-snug text-mist">
            I agree to receive information about relevant opportunities from{" "}
            {site.name}.
          </span>
        </label>

        {error && <p className={errorCls}>{error}</p>}

        <button
          type="submit"
          className="mt-7 rounded-full bg-gold px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
        >
          Subscribe for updates
        </button>
      </form>
    </section>
  );
}
