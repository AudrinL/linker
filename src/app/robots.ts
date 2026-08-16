import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The staff dashboard and its proxy routes are noindex in metadata too;
    // this keeps well-behaved crawlers from requesting them at all.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
