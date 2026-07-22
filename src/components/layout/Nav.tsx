"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { nav, site } from "@/lib/site";
import { cn, prefersReducedMotion } from "@/lib/utils";

/**
 * Fixed navigation. Transparent over the hero, condensing into a frosted pill
 * once the visitor commits to scrolling. The mobile menu is a full-screen
 * editorial takeover rather than a dropdown — it gets the same typographic
 * treatment as the rest of the site.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the takeover on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock the page behind the open menu, and allow Escape to dismiss it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open || !panel.current || prefersReducedMotion()) return;
      const items = panel.current.querySelectorAll("[data-menu-item]");
      gsap.fromTo(
        items,
        { yPercent: 108, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.055,
          ease: "expo.out",
          delay: 0.1,
        },
      );
    },
    { dependencies: [open] },
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled ? "py-3" : "py-5",
        )}
        style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
      >
        <div className="shell">
          <div
            className={cn(
              "flex items-center justify-between gap-6 rounded-full transition-all duration-700",
              scrolled
                ? "glass-strong px-4 py-2.5 sm:px-5"
                : "border border-transparent px-1 py-2",
            )}
            style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
          >
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3"
              aria-label={`${site.name} — home`}
            >
              <span className="relative block size-10 overflow-hidden rounded-full bg-bone/95 ring-1 ring-mist/20">
                <Image
                  src="/img/logo.jpeg"
                  alt=""
                  fill
                  sizes="40px"
                  className="scale-[1.35] object-cover object-[50%_38%]"
                  priority
                />
              </span>
              <span className="hidden leading-none sm:block">
                <span className="block font-display text-[1.05rem] tracking-tight">
                  Linker World
                </span>
                <span className="block text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted">
                  Travel
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-0.5 lg:flex">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.82rem] font-medium tracking-tight transition-colors duration-300",
                      active
                        ? "text-gold"
                        : "text-mist/75 hover:text-bone",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold/70" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="hidden rounded-full bg-gold px-5 py-2.5 text-[0.82rem] font-medium tracking-tight text-abyss transition-colors duration-500 hover:bg-bone md:inline-block"
              >
                Start your journey
              </Link>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="relative z-[70] grid size-11 place-items-center rounded-full border border-mist/20 transition-colors duration-300 hover:border-gold/60 lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 block h-px w-full bg-bone transition-all duration-500",
                      open ? "top-1.5 rotate-45" : "top-0",
                    )}
                    style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
                  />
                  <span
                    className={cn(
                      "absolute left-0 block h-px bg-bone transition-all duration-500",
                      open ? "top-1.5 w-full -rotate-45" : "top-3 w-3/4",
                    )}
                    style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile takeover */}
      <div
        ref={panel}
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] flex flex-col justify-center bg-abyss/97 backdrop-blur-2xl transition-opacity duration-500 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="shell">
          <nav className="flex flex-col gap-1">
            {[{ label: "Home", href: "/" }, ...nav].map((item) => (
              <span key={item.href} className="line-mask">
                <Link
                  href={item.href}
                  data-menu-item
                  tabIndex={open ? 0 : -1}
                  className="block py-1.5 font-display text-[clamp(2.1rem,10vw,3.4rem)] leading-[1.02] tracking-tight text-bone transition-colors duration-300 hover:text-gold"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="mt-12 flex flex-col gap-4 border-t border-mist/12 pt-8">
            {site.phones.map((p) => (
              <a
                key={p.e164}
                href={`tel:+${p.e164}`}
                tabIndex={open ? 0 : -1}
                className="text-lg tracking-tight text-mist transition-colors hover:text-gold"
              >
                {p.display}
              </a>
            ))}
            <Link
              href="/contact"
              tabIndex={open ? 0 : -1}
              className="mt-2 inline-flex w-fit rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-abyss"
            >
              Start your journey
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
