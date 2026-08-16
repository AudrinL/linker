"use client";

import { deletePost } from "@/app/admin/actions";

/**
 * Deleting a post is not recoverable — the backend has no soft delete — so it
 * asks first. Unpublishing is the reversible option and the copy says so.
 */
export default function DeletePostForm({ slug, title }: { slug: string; title: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      className="mt-8 flex flex-wrap items-center gap-4 border-t border-mist/12 pt-6"
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="rounded-full border border-ember/30 px-5 py-2.5 text-xs text-ember transition-colors hover:bg-ember/[0.06]"
      >
        Delete this post
      </button>
      <span className="text-xs text-muted">
        Permanent. Unpublish instead if you only want it off the site.
      </span>
    </form>
  );
}
