import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, adminApi, requireSession } from "@/lib/admin/api";
import { formatDateTime } from "@/lib/admin/format";
import { PageHeader } from "@/components/admin/Panel";
import PostEditor from "@/components/admin/PostEditor";
import DeletePostForm from "@/components/admin/DeletePostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireSession();
  const { slug } = await params;

  let post;
  try {
    post = await adminApi.post(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <>
      <Link
        href="/admin/blog"
        className="mb-5 inline-block text-xs text-muted transition-colors hover:text-bone"
      >
        ← Journal
      </Link>

      <PageHeader
        title="Edit post"
        subtitle={`Last saved ${formatDateTime(post.updated_at)}`}
        action={
          post.published ? (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="rounded-full border border-mist/20 px-4 py-2 text-xs transition-colors hover:border-gold hover:text-gold"
            >
              View live
            </Link>
          ) : null
        }
      />

      <PostEditor post={post} />

      <DeletePostForm slug={post.slug} title={post.title} />
    </>
  );
}
