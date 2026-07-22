import type { MetadataRoute } from "next";
import { site, nav } from "@/lib/site";

/** Only routes that actually exist are listed. Add entries as pages ship. */
const LIVE_ROUTES = ["/", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  void nav; // nav is the full planned IA; sitemap tracks what is built.
  return LIVE_ROUTES.map((route) => ({
    url: `${site.url}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
