import Link from "next/link";
import { requireSession } from "@/lib/admin/api";
import { PageHeader } from "@/components/admin/Panel";
import PostEditor from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  await requireSession();

  return (
    <>
      <Link
        href="/admin/blog"
        className="mb-5 inline-block text-xs text-muted transition-colors hover:text-bone"
      >
        ← Journal
      </Link>
      <PageHeader
        title="New post"
        subtitle="It stays a draft until you tick Published."
      />
      <PostEditor />
    </>
  );
}
