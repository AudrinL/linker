import Link from "next/link";
import { adminApi, requireSession } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/format";
import { ApiDown, EmptyState, PageHeader, Panel } from "@/components/admin/Panel";

export default async function BlogAdminPage() {
  await requireSession();

  let posts: Awaited<ReturnType<typeof adminApi.posts>> | null = null;
  let failure: string | undefined;
  try {
    posts = await adminApi.posts();
  } catch (error) {
    failure = error instanceof Error ? error.message : undefined;
  }

  if (!posts) {
    return (
      <>
        <PageHeader title="Journal" />
        <ApiDown detail={failure} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Journal"
        subtitle="Drafts and published posts."
        action={
          <Link
            href="/admin/blog/new"
            className="rounded-full bg-gold px-5 py-2.5 text-xs font-medium text-white transition-opacity duration-300 hover:opacity-90"
          >
            New post
          </Link>
        }
      />

      <Panel>
        {posts.length === 0 ? (
          <EmptyState>
            No posts yet. The public journal reads from this list once a post is
            published.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-mist/10">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/admin/blog/${post.slug}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-abyss"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{post.title}</p>
                    <p className="truncate text-xs text-muted">/blog/{post.slug}</p>
                  </div>

                  <span className="text-xs text-mist">{post.category}</span>
                  <span
                    className={
                      post.published
                        ? "rounded-full bg-verdant/15 px-2.5 py-1 text-[0.7rem] font-medium text-verdant"
                        : "rounded-full bg-mist/12 px-2.5 py-1 text-[0.7rem] font-medium text-muted"
                    }
                  >
                    {post.published ? "Live" : "Draft"}
                  </span>
                  <span className="w-28 text-right text-xs text-muted">
                    {formatDate(post.updated_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
