import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  // Belt and braces alongside the disallow in robots.ts: a staff inbox has no
  // business in an index, and the login screen is a phishing target if it is.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Shared shell for both the login screen and the dashboard proper. The
 * marketing nav and footer are already suppressed here by SiteChrome.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-abyss">{children}</div>;
}
