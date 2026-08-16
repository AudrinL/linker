"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deletePost, type ActionState } from "@/app/admin/actions";

function Delete() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-ember/30 px-5 py-2.5 text-xs text-ember transition-colors hover:bg-ember/[0.06] disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete this post"}
    </button>
  );
}

/**
 * Deleting a post is not recoverable — there is no soft delete — so it asks
 * first. Unpublishing is the reversible option and the copy says so.
 *
 * The action reports failures rather than returning void, because a delete can
 * be refused: the post may already be gone, or the account's approval may have
 * been withdrawn since the page rendered. Silently redirecting to a list that
 * still shows the post is the one outcome worth ruling out.
 */
export default function DeletePostForm({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [state, action] = useActionState<ActionState, FormData>(deletePost, {});

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      className="mt-8 flex flex-wrap items-center gap-4 border-t border-mist/12 pt-6"
    >
      <input type="hidden" name="slug" value={slug} />
      <Delete />
      {state.error ? (
        <span role="alert" className="text-xs text-ember">
          {state.error}
        </span>
      ) : (
        <span className="text-xs text-muted">
          Permanent. Unpublish instead if you only want it off the site.
        </span>
      )}
    </form>
  );
}
