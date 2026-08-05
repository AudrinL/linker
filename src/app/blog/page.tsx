import { blogPosts } from "@/lib/blog";
import { PageHero } from "@/components/ui/PageHero";
import { PostCard } from "@/components/ui/PostCard";
import { TrustBar } from "@/components/ui/TrustBar";
import { trustMarks } from "@/lib/services-data";

export const metadata = {
  title: "Linker World Journal — Linker World Travel",
  description:
    "Insights, travel guides and success stories from the Linker World Travel community.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Linker World Journal"
        subtitle="Insights, travel guides, and success stories from our community."
      />
      <main className="shell py-16 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <TrustBar items={trustMarks} className="mt-20" />
      </main>
    </div>
  );
}
