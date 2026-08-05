import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Linker World Travel`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden pt-32 pb-16 lg:pt-44 lg:pb-20">
        <div className="absolute inset-0 bg-abyss">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mist/5 via-abyss to-abyss" />
        </div>
        <div className="shell relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-gold/10 px-3 py-1 font-medium tracking-tight text-gold">
              {post.category}
            </span>
            <span className="text-mist">{post.readTime}</span>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight tracking-tight text-bone sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mist">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-mist/15 pt-6 text-sm text-mist">
            <span>
              By <span className="font-medium text-bone">{post.author}</span>
            </span>
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </header>

      <article className="shell max-w-3xl py-12 lg:py-16">
        {post.sections.map((section, i) => (
          <section key={i} className="pb-10">
            {section.heading && (
              <h2 className="mb-5 font-display text-2xl tracking-tight text-bone sm:text-3xl">
                {section.heading}
              </h2>
            )}
            {section.body.map((paragraph, j) => (
              <p key={j} className="mb-5 text-[1.05rem] leading-relaxed text-bone/85">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-6 rounded-3xl border border-gold/25 bg-gold/[0.05] p-8">
          <h3 className="font-display text-2xl tracking-tight text-bone">
            Ready to make it happen?
          </h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">
            Our consultants work with exactly these routes every week. Tell us
            your situation and we will reply within one working day.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-gold px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-colors duration-500 hover:bg-bone"
          >
            Talk to a consultant
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="shell pb-24 lg:pb-32">
          <SectionHeading eyebrow="Keep reading" title="Related articles" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
