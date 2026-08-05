import type { Metadata } from "next";
import Image from "next/image";
import InquiryForm from "@/components/forms/InquiryForm";
import SplitLines from "@/components/motion/SplitLines";
import Reveal from "@/components/motion/Reveal";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Speak to a Linker World Travel consultant in Kigali about overseas jobs, visa applications, flights, safaris or vehicle import. Call, WhatsApp or send an inquiry.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      {/* Opening frame */}
      <section className="relative isolate grain flex min-h-[62svh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/img/travel-terminal.png"
            alt=""
            fill
            priority
            quality={82}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--color-abyss) 82%, transparent) 0%, color-mix(in oklab, var(--color-abyss) 50%, transparent) 40%, color-mix(in oklab, var(--color-abyss) 22%, transparent) 100%)",
            }}
          />
          <div className="vignette absolute inset-0" />
        </div>

        <div className="shell relative pb-16 pt-32">
          <div className="flex items-center gap-3.5">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="eyebrow">Contact</span>
          </div>
          <SplitLines
            as="h1"
            immediate
            delay={0.2}
            className="mt-6 text-headline font-display"
            lines={[
              "Start with a",
              '<em class="italic text-gradient-warm">conversation.</em>',
            ]}
          />
          <p className="mt-7 max-w-xl text-lede text-mist/85">
            Tell us what you are planning. We will tell you honestly whether we
            can help, what it involves, and what it costs — before you commit to
            anything.
          </p>
        </div>
      </section>

      {/* Form and details */}
      <section className="relative bg-abyss py-20 sm:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal>
              <InquiryForm />
            </Reveal>

            <Reveal delay={0.12} className="flex flex-col gap-8">
              <div>
                <h2 className="eyebrow font-sans">Call us</h2>
                <div className="mt-4 flex flex-col gap-2">
                  {site.phones.map((p) => (
                    <a
                      key={p.e164}
                      href={`tel:+${p.e164}`}
                      className="font-display text-[clamp(1.4rem,2.6vw,2rem)] tracking-tight transition-colors duration-300 hover:text-gold"
                    >
                      {p.display}
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-mist/12 pt-8">
                <h2 className="eyebrow font-sans">WhatsApp</h2>
                <a
                  href={whatsappLink(
                    site.whatsapp,
                    `Hello ${site.name}, I would like to speak to a consultant about `,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#1eb355] px-6 py-3.5 text-sm font-medium text-white transition-transform duration-500 hover:scale-[1.03]"
                >
                  <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden>
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23z" />
                  </svg>
                  Chat with a consultant
                </a>
              </div>

              <div className="border-t border-mist/12 pt-8">
                <h2 className="eyebrow font-sans">Email</h2>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 block text-[1.05rem] tracking-tight text-mist transition-colors duration-300 hover:text-gold"
                >
                  {site.email}
                </a>
              </div>

              <div className="border-t border-mist/12 pt-8">
                <h2 className="eyebrow font-sans">Office</h2>
                <p className="mt-4 text-[1.05rem] text-mist">
                  {site.address.line}
                </p>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                  {site.hours}
                </p>
              </div>

              <div className="border-t border-mist/12 pt-8">
                <h2 className="eyebrow font-sans">Follow</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-mist/18 px-4 py-2 text-xs font-medium tracking-tight text-mist transition-colors duration-300 hover:border-gold/60 hover:text-gold"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Map */}
          <Reveal className="mt-16">
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-mist/12">
              <iframe
                title="Linker World Travel office location in Kigali, Rwanda"
                src="https://www.openstreetmap.org/export/embed.html?bbox=30.0300%2C-1.9750%2C30.1300%2C-1.9200&layer=mapnik"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[380px] w-full grayscale-[0.35] contrast-[1.1]"
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              Kigali, Rwanda. Call ahead to arrange an in-person consultation.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
