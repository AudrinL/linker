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
    ];
  },
};

export default nextConfig;
