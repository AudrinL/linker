import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

/**
 * The opening frame.
 *
 * Deliberately a Server Component. The previous hero was a client component
 * running a GSAP entrance and a scrubbed ScrollTrigger timeline, with the
 * headline rendered through `SplitLines` — which keeps every line at
 * `opacity: 0` until hydration. The single most valuable thing on the page
 * therefore could not paint until JavaScript arrived. It is now plain server
 * HTML with a CSS load animation, so the headline is the first thing drawn.
 *
 * It also asks for one thing. The old hero offered two equal buttons, four
 * statistics and a scroll cue; the ask now is a free consultation, with
 * WhatsApp beside it for the many visitors who prefer to start there.
 */
export default function Hero() {
  return (
    <section className="relative isolate grain flex min-h-[86svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/hero%20image.png"
          alt=""
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Grade: dense at the base where the copy sits, clear above so the
            photography still carries the section. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-bone) 82%, transparent) 0%, color-mix(in oklab, var(--color-bone) 52%, transparent) 30%, transparent 62%), linear-gradient(to right, color-mix(in oklab, var(--color-bone) 46%, transparent) 0%, transparent 52%)",
          }}
        />
        <div className="vignette absolute inset-0" />
      </div>

      <div className="shell relative z-10 pb-14 pt-28 sm:pb-20">
        <div className="max-w-3xl">
          <div className="settle flex items-center gap-3.5">
            <span className="h-px w-10 shrink-0 bg-gold/70" />
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-white/90">
              Kigali · Rwanda · Since 2014
            </span>
          </div>

          <h1
            className="settle mt-6 text-display font-display text-white"
            style={{ animationDelay: "0.08s" }}
          >
            Go abroad.
            <br />
            We handle{" "}
            <em className="whitespace-nowrap italic text-gradient-warm-dark">
              the rest.
            </em>
          </h1>

          <p
            className="settle mt-7 max-w-xl text-lede text-white/85"
            style={{ animationDelay: "0.16s" }}
          >
            Overseas jobs, university places, visas and flights — arranged end
            to end from our Kigali office, by one consultant who stays with you
            from the first call to the day you land.
          </p>

          <div
            className="settle mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.24s" }}
          >
            <Link
              href="#start"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-4 text-[0.95rem] font-semibold tracking-tight text-white shadow-[0_14px_40px_-12px_rgba(189,74,8,0.6)] transition-colors duration-300 hover:bg-white hover:text-bone"
            >
              Get a free consultation
              <svg
                viewBox="0 0 16 16"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <a
              href={whatsappLink(
                site.whatsapp,
                `Hello ${site.name}, I would like to speak to a consultant about `,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/35 bg-bone/30 px-8 py-4 text-[0.95rem] font-medium tracking-tight text-white backdrop-blur-md transition-colors duration-300 hover:border-white/70"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.02c-.25.69-1.44 1.32-1.99 1.4-.53.08-1.17.11-1.89-.12-.44-.14-1-.32-1.72-.64-3.03-1.31-5.01-4.36-5.16-4.56-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.53c.28-.31.61-.38.81-.38l.58.01c.19.01.44-.07.68.52.25.6.86 2.08.93 2.23.08.15.13.33.03.53-.1.2-.15.33-.29.5-.15.18-.31.39-.44.53-.15.15-.3.31-.13.6.17.3.75 1.23 1.6 2 1.1.98 2.03 1.28 2.33 1.43.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.39-.25.66-.15.27.1 1.71.81 2 .96.3.15.49.22.56.35.07.12.07.72-.18 1.41z" />
              </svg>
              Message on WhatsApp
            </a>
          </div>

          {/* The three objections that stop people calling, answered before
              they are asked. */}
          <ul
            className="settle mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.78rem] font-medium text-white/85"
            style={{ animationDelay: "0.32s" }}
          >
            {[
              "Free consultation",
              "No upfront fee",
              "Reply within one working day",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 shrink-0 stroke-amber"
                  fill="none"
                  strokeWidth="2.4"
                  aria-hidden
                >
                  <path d="M4 12.5l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
