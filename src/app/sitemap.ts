import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { blogPosts } from "@/lib/blog";
import { jobs } from "@/lib/jobs";

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
  { route: "/visa-support", priority: 0.9, changeFrequency: "weekly" },
  { route: "/flight-tickets", priority: 0.9, changeFrequency: "weekly" },
  { route: "/opportunities", priority: 0.9, changeFrequency: "weekly" },
  { route: "/travel", priority: 0.8, changeFrequency: "weekly" },
];

const SUBPAGES: Entry[] = [
  { route: "/jobs", priority: 0.8, changeFrequency: "weekly" },
  { route: "/work-abroad/recruitment", priority: 0.8, changeFrequency: "monthly" },
  { route: "/work-abroad/employer-matching", priority: 0.8, changeFrequency: "monthly" },
  { route: "/work-abroad/work-permits", priority: 0.8, changeFrequency: "monthly" },
  { route: "/study-abroad/universities", priority: 0.8, changeFrequency: "monthly" },
  { route: "/study-abroad/study-visa", priority: 0.8, changeFrequency: "monthly" },
  { route: "/study-abroad/admission-guidance", priority: 0.8, changeFrequency: "monthly" },
  { route: "/travel/hotels", priority: 0.8, changeFrequency: "monthly" },
  { route: "/travel/holiday-packages", priority: 0.8, changeFrequency: "monthly" },
  ...jobs.map(
    (job): Entry => ({
      route: `/jobs/${job.slug}`,
      priority: 0.7,
      changeFrequency: "weekly",
    }),
  ),
];

const FUNNELS: Entry[] = [
  { route: "/work-abroad/apply", priority: 0.9, changeFrequency: "monthly" },
  { route: "/study-abroad/apply", priority: 0.9, changeFrequency: "monthly" },
  { route: "/visa-support/apply", priority: 0.9, changeFrequency: "monthly" },
  { route: "/flight-tickets/request", priority: 0.9, changeFrequency: "monthly" },
  { route: "/submit-cv", priority: 0.9, changeFrequency: "monthly" },
  { route: "/employers", priority: 0.9, changeFrequency: "monthly" },
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
