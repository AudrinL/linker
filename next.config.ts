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
};

export default nextConfig;
