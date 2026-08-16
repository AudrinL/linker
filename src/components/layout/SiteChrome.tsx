"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import WhatsAppFab from "./WhatsAppFab";
import SmoothScroll from "@/components/providers/SmoothScroll";

/**
 * Wraps the marketing chrome — nav, footer, WhatsApp button, Lenis smoothing —
 * and drops all of it on `/admin`.
 *
 * The staff dashboard is a different product sharing a domain: it has its own
 * navigation, it should not offer visitors a WhatsApp button, and hijacked
 * scrolling makes a long inbox table miserable to work in.
 *
 * The conventional way to express this is a `(site)` route group with its own
 * layout, which needs every marketing page directory to move. This achieves
 * the same result without that churn. The cost is that the check runs on the
 * client, so the split is by URL rather than by file location — keep it in
 * sync if the dashboard ever moves off `/admin`.
 *
 * `footer` arrives as a prop because `<Footer />` is a Server Component and
 * this file is not; a server-rendered element can be passed in, but it cannot
 * be imported here.
 */
export default function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
      {footer}
      <WhatsAppFab />
    </>
  );
}
