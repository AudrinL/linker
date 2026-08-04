import Link from "next/link";
import Image from "next/image";
import { site, footerNav } from "@/lib/site";

/**
 * Closing frame. Oversized wordmark, quiet utility links, real contact detail.
 * The last thing a visitor sees should still feel composed.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-mist/10 bg-abyss pt-24">
      {/* Warm horizon glow rising behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 118%, var(--color-amber) 0%, transparent 62%)",
        }}
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3.5">
              <span className="relative block size-12 overflow-hidden rounded-2xl bg-white ring-1 ring-mist/15">
                <Image
                  src="/img/logo.jpeg"
                  alt=""
                  fill
                  sizes="48px"
                  className="scale-[1.35] object-cover object-[50%_38%]"
                />
              </span>
              <span className="leading-none">
                <span className="block font-display text-xl tracking-tight">
                  Linker World
                </span>
                <span className="block text-[0.62rem] font-medium uppercase tracking-[0.3em] text-muted">
                  Travel
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Connecting Africa to the world since 2014. Overseas careers, visas,
              travel, safaris and vehicle logistics — handled by one team, from
              Kigali.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
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

          {footerNav.map((col) => (
            <div key={col.heading}>
              <h3 className="eyebrow font-sans">{col.heading}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[0.95rem] text-mist/85 transition-colors duration-300 hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="eyebrow font-sans">Get in touch</h3>
            <ul className="mt-5 space-y-3">
              {site.phones.map((p) => (
                <li key={p.e164}>
                  <a
                    href={`tel:+${p.e164}`}
                    className="text-[0.95rem] text-mist/85 transition-colors duration-300 hover:text-gold"
                  >
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.95rem] text-mist/85 transition-colors duration-300 hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              <li className="pt-1 text-[0.95rem] text-muted">
                {site.address.line}
              </li>
              <li className="text-[0.85rem] leading-relaxed text-muted/80">
                {site.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark, clipped by the fold */}
        <div className="relative mt-24 select-none">
          <p
            aria-hidden
            className="translate-y-[18%] whitespace-nowrap text-center font-display text-[clamp(3.5rem,17vw,15rem)] leading-[0.8] tracking-[-0.045em] text-bone/[0.07]"
          >
            Linker World Travel
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-mist/10 py-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
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
