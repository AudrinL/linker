import Image from "next/image";
import SplitLines from "@/components/motion/SplitLines";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/motion/Reveal";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

/**
 * The closing frame. Returns to the sky the site opened on, so the experience
 * lands where it started — and puts a real phone number under the headline,
 * because the whole point is that someone picks up.
 */
export default function ClosingCTA() {
  return (
    <section className="relative isolate grain overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/travel-terminal.png"
          alt=""
          fill
          quality={82}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--color-abyss) 55%, transparent) 0%, color-mix(in oklab, var(--color-abyss) 30%, transparent) 44%, color-mix(in oklab, var(--color-abyss) 78%, transparent) 100%)",
          }}
        />
        <div className="vignette absolute inset-0" />
      </div>

      <div className="shell relative py-32 sm:py-44">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="flex items-center justify-center gap-3.5">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="eyebrow">Let&apos;s begin</span>
          </Reveal>

          <SplitLines
            as="h2"
            className="mt-8 text-headline font-display"
            lines={[
              "Tell us where you",
              'want to <em class="italic text-gradient-warm">end up.</em>',
            ]}
          />

          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-xl text-lede text-mist/85">
              One conversation is usually enough to know whether we can help —
              and we will tell you honestly if we cannot. No fee to ask.
            </p>
          </Reveal>

          <Reveal
            delay={0.25}
            className="mt-11 flex flex-wrap items-center justify-center gap-3.5"
          >
            <MagneticButton
              href={whatsappLink(
                site.whatsapp,
                `Hello ${site.name}, I would like to speak to a consultant about `,
              )}
              external
            >
              Message us on WhatsApp
            </MagneticButton>
            <MagneticButton href="/contact" variant="outline">
              Send an inquiry
            </MagneticButton>
          </Reveal>

          <Reveal delay={0.35} className="mt-14">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted">
              Or call us directly
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {site.phones.map((p) => (
                <a
                  key={p.e164}
                  href={`tel:+${p.e164}`}
                  className="font-display text-[clamp(1.25rem,2.4vw,1.85rem)] tracking-tight text-bone transition-colors duration-300 hover:text-gold"
                >
                  {p.display}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
