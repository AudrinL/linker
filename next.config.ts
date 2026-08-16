import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Quality tiers used across the site: 75 default, 82 editorial, 88 hero.
    qualities: [75, 82, 88],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
  poweredByHeader: false,
  compress: true,

  /**
   * Headers for the staff dashboard.
   *
   * Netlify's CDN sits in front of this app. A cached `/admin` response would
   * mean one member of staff's applicant list being served to whoever asks
   * next, so every dashboard response is marked uncacheable at every layer.
   *
   * The framing rules exist because a dashboard is a clickjacking target: the
   * status and delete controls are one click each, and an invisible iframe on
   * a page a staff member already trusts is all it takes. `frame-ancestors`
   * is the modern rule; `X-Frame-Options` covers older browsers.
   */
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          // Keeps record ids and search terms out of the Referer header on
          // any outbound click (the mailto and wa.me links on detail pages).
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        // The CSV export and the form proxies, same reasoning.
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },

  // Visa support moved out from under /travel to a top-level page. These are
  // permanent so the old URLs keep whatever ranking they had.
  async redirects() {
    return [
      {
        source: "/travel/visa-services",
        destination: "/visa-support",
        permanent: true,
      },
      {
        source: "/travel/visa-services/apply",
        destination: "/visa-support/apply",
        permanent: true,
      },
      // The brief's information architecture is flat: jobs and flights are
      // top-level services, not sub-pages of a hub.
      {
        source: "/work-abroad/jobs",
        destination: "/jobs",
        permanent: true,
      },
      {
        source: "/travel/flight-booking",
        destination: "/flight-tickets",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
