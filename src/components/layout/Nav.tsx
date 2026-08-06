"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { nav, site, type NavItem } from "@/lib/site";
import { cn, prefersReducedMotion } from "@/lib/utils";

function DesktopNavItem({ item, pathname }: { item: NavItem, pathname: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const active = pathname === item.href || item.items?.some(sub => pathname === sub.href);
  const hasDropdown = !!item.items?.length;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.82rem] font-medium tracking-tight transition-colors duration-300",
          active ? "text-gold" : "text-mist/75 hover:text-bone",
        )}
      >
        {item.label}
        {hasDropdown && (
          <svg className={cn("size-3.5 transition-transform duration-300", isHovered && "rotate-180")} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        )}
        {active && (
          <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold/70" />
        )}
      </Link>
      
      {hasDropdown && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-1/2 top-full z-[100] mt-2 w-56 -translate-x-1/2 rounded-2xl border border-mist/10 bg-abyss/85 p-2 shadow-2xl backdrop-blur-xl"
            >
              {item.items!.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-mist transition-colors hover:bg-mist/10 hover:text-bone"
                >
                  {sub.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function MobileNavItem({
  item,
  open,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDropdown = !!item.items?.length;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <Link
          href={item.href}
          data-menu-item
          tabIndex={open ? 0 : -1}
          onClick={onNavigate}
          className="block py-1 font-display text-[clamp(1.6rem,6.5vw,2.4rem)] leading-[1.1] tracking-tight text-bone transition-colors duration-300 hover:text-gold"
        >
          {item.label}
        </Link>
        {hasDropdown && (
          <button
            data-menu-item
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-mist transition-colors hover:text-gold"
            aria-label="Toggle submenu"
          >
            <svg className={cn("size-8 transition-transform duration-300", expanded && "rotate-180")} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      {hasDropdown && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 py-4 pl-4 border-l border-mist/20 ml-2">
                {item.items!.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    tabIndex={open ? 0 : -1}
                    onClick={onNavigate}
                    className="block font-display text-2xl text-mist transition-colors hover:text-bone"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

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
  const closeMenu = () => setOpen(false);

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
          "fixed inset-x-0 top-0 z-[65] transition-all duration-700",
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
              <span className="relative block size-10 overflow-hidden rounded-full bg-white ring-1 ring-mist/20">
                <Image
                  src="/img/logo.jpeg"
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </span>
              <span className="hidden leading-none sm:block">
                <span className="block font-display text-[1.05rem] tracking-tight">
                  <span className="text-bone">Linker</span>
                  <span className="text-gold">World</span>
                </span>
                <span className="block text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted">
                  Travel
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-0.5 lg:flex">
              <DesktopNavItem item={{ label: "Home", href: "/" }} pathname={pathname} />
              {nav.map((item) => (
                <DesktopNavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="hidden rounded-full bg-gold px-5 py-2.5 text-[0.82rem] font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone md:inline-block"
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
          "fixed inset-0 z-[60] overflow-y-auto bg-abyss/97 backdrop-blur-2xl transition-opacity duration-500 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="shell flex min-h-full flex-col justify-center py-24">
          <nav
            key={open ? "menu-open" : "menu-closed"}
            className="flex flex-col gap-1"
          >
            <MobileNavItem item={{ label: "Home", href: "/" }} open={open} onNavigate={closeMenu} />
            {nav.map((item) => (
              <MobileNavItem key={item.href} item={item} open={open} onNavigate={closeMenu} />
            ))}
          </nav>

          <div className="mt-12 flex flex-col gap-4 border-t border-mist/12 pt-8">
            {site.phones.map((p) => (
              <a
                key={p.e164}
                href={`tel:+${p.e164}`}
                tabIndex={open ? 0 : -1}
                onClick={closeMenu}
                className="text-lg tracking-tight text-mist transition-colors hover:text-gold"
              >
                {p.display}
              </a>
            ))}
            <Link
              href="/contact"
              tabIndex={open ? 0 : -1}
              onClick={closeMenu}
              className="mt-2 inline-flex w-fit rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-white"
            >
              Start your journey
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
