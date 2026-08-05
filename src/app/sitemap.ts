import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { blogPosts } from "@/lib/blog";

type Entry = {
  route: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

const CORE: Entry[] = [
  { route: "/", priority: 1, changeFrequency: "weekly" },
  { route: "/about", priority: 0.8, changeFrequency: "monthly" },
  { route: "/contact", priority: 0.9, changeFrequency: "monthly" },
];

const SERVICES: Entry[] = [
  { route: "/work-abroad", priority: 0.9, changeFrequency: "weekly" },
  { route: "/study-abroad", priority: 0.9, changeFrequency: "weekly" },
  { route: "/travel", priority: 0.9, changeFrequency: "weekly" },
  { route: "/safari-tours", priority: 0.9, changeFrequency: "weekly" },
  { route: "/vehicle-import-export", priority: 0.9, changeFrequency: "weekly" },
];

const SUBPAGES: Entry[] = [
  { route: "/work-abroad/jobs", priority: 0.8, changeFrequency: "weekly" },
  { route: "/work-abroad/recruitment", priority: 0.8, changeFrequency: "monthly" },
  { route: "/work-abroad/employer-matching", priority: 0.8, changeFrequency: "monthly" },
  { route: "/work-abroad/work-permits", priority: 0.8, changeFrequency: "monthly" },
  { route: "/study-abroad/universities", priority: 0.8, changeFrequency: "monthly" },
  { route: "/study-abroad/study-visa", priority: 0.8, changeFrequency: "monthly" },
  { route: "/study-abroad/admission-guidance", priority: 0.8, changeFrequency: "monthly" },
  { route: "/travel/flight-booking", priority: 0.8, changeFrequency: "monthly" },
  { route: "/travel/hotels", priority: 0.8, changeFrequency: "monthly" },
  { route: "/travel/holiday-packages", priority: 0.8, changeFrequency: "monthly" },
  { route: "/travel/visa-services", priority: 0.8, changeFrequency: "monthly" },
];

const FUNNELS: Entry[] = [
  { route: "/work-abroad/apply", priority: 0.9, changeFrequency: "monthly" },
  { route: "/study-abroad/apply", priority: 0.9, changeFrequency: "monthly" },
  { route: "/travel/visa-services/apply", priority: 0.9, changeFrequency: "monthly" },
  { route: "/safari-tours/book", priority: 0.9, changeFrequency: "monthly" },
  { route: "/vehicle-import-export/quote", priority: 0.9, changeFrequency: "monthly" },
];

const BLOG: Entry[] = [
  { route: "/blog", priority: 0.8, changeFrequency: "weekly" },
  ...blogPosts.map(
    (post): Entry => ({
      route: `/blog/${post.slug}`,
      priority: 0.6,
      changeFrequency: "monthly",
    }),
  ),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...CORE, ...SERVICES, ...SUBPAGES, ...FUNNELS, ...BLOG].map(
    ({ route, priority, changeFrequency }) => ({
      url: `${site.url}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }),
  );
}
