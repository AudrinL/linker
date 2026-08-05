import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: BlogPost;
  className?: string;
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Journal card linking into the dynamic /blog/[slug] pages. */
export function PostCard({ post, className }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-3xl border border-mist/15 bg-ink-soft/60 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/[0.04]",
        className,
      )}
    >
      <div className="flex items-center gap-3 text-xs">
        <span className="rounded-full bg-gold/10 px-3 py-1 font-medium tracking-tight text-gold">
          {post.category}
        </span>
        <span className="text-mist">{post.readTime}</span>
      </div>
      <h3 className="mt-4 font-display text-xl leading-snug tracking-tight text-bone transition-colors duration-300 group-hover:text-gold">
        {post.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
        {post.excerpt}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-mist/10 pt-4 text-xs text-mist">
        <span>{post.author}</span>
        <span>{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}
