import Link from "next/link";
import Image from "next/image";
import { site, footerNav } from "@/lib/site";

/**
 * Closing frame. Oversized wordmark, quiet utility links, real contact detail.
 * The last thing a visitor sees should still feel composed.
 *
 * Set on the logo's ocean navy — `bone` deepening into `deep` — so the page
 * closes on the darkest surface it owns rather than fading out on the same
 * canvas the last five sections used. That inverts the type: on this ground the
 * palette's greys (`mist`, `muted`) have no contrast at all, so everything here
 * is a white at a fixed opacity instead.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden pt-24 text-white"
      style={{
        // Flat `bone` — the darkest navy in the palette, and the wordmark's own
        // colour. Any lift toward `deep` brightens the base of the page, so the
        // depth here comes from the two glows rather than from the ground.
        background: "var(--color-bone)",
      }}
    >
      {/* Warm horizon glow rising behind the wordmark. It carries further on
          navy than it did on the light canvas, so it runs cooler. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] opacity-[0.13]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 118%, var(--color-amber) 0%, transparent 62%)",
        }}
      />
      {/* Cyan rake from the upper left, the same light the logo's globe sits in */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 8% 0%, var(--color-cyan) 0%, transparent 68%)",
        }}
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3.5">
              <span className="relative block size-12 overflow-hidden rounded-2xl bg-white ring-1 ring-white/20">
                <Image
                  src="/img/logo.jpeg"
                  alt=""
                  fill
                  sizes="48px"
                  className="scale-[1.35] object-cover object-[50%_38%]"
                />
              </span>
              <span className="leading-none">
                <span className="block font-display text-xl tracking-tight text-white">
                  Linker World
                </span>
                <span className="block text-[0.62rem] font-medium uppercase tracking-[0.3em] text-white/55">
                  Travel
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/65">
              Connecting Africa to the world since 2014. Overseas careers, study
              placements, visas and travel, handled by one team, from Kigali.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium tracking-tight text-white/80 transition-colors duration-300 hover:border-amber/70 hover:text-amber"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.heading}>
              {/* `.eyebrow` is `gold`, which is tuned for white text on the light
                  canvas and goes muddy here; `amber` is the logo's sun and is
                  only unusable as type on light grounds, not on this one. */}
              <h3 className="eyebrow font-sans text-amber">{col.heading}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[0.95rem] text-white/70 transition-colors duration-300 hover:text-amber"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="eyebrow font-sans text-amber">Get in touch</h3>
            <ul className="mt-5 space-y-3">
              {site.phones.map((p) => (
                <li key={p.e164}>
                  <a
                    href={`tel:+${p.e164}`}
                    className="text-[0.95rem] text-white/70 transition-colors duration-300 hover:text-amber"
                  >
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.95rem] text-white/70 transition-colors duration-300 hover:text-amber"
                >
                  {site.email}
                </a>
              </li>
              <li className="pt-1 text-[0.95rem] text-white/55">
                {site.address.line}
              </li>
              <li className="text-[0.85rem] leading-relaxed text-white/55">
                {site.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark.
            It used to be pushed down far enough that the rule above the legal
            row cut through the letterforms; it now sits clear of it, and at a
            lower opacity, because white on navy carries much further than the
            old navy-on-canvas did at the same value. */}
        <div className="wordmark relative mt-24 select-none">
          <p
            aria-hidden
            className="whitespace-nowrap text-center font-display leading-[0.8] tracking-[-0.045em] text-white/[0.06]"
          >
            Linker World Travel
          </p>
        </div>

        {/* `pr` on the last row keeps the legal line out from under the fixed
            WhatsApp button, which was sitting on top of it. */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/12 py-7 pr-16 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:pr-20">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="tracking-tight">
            Licensed travel &amp; recruitment services · {site.address.line}
          </p>
        </div>
      </div>
    </footer>
  );
}
