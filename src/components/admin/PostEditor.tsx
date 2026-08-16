"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { savePost, type ActionState } from "@/app/admin/actions";
import type { BlogPost } from "@/lib/admin/types";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    // Strip the combining marks NFD just split off, so "Kigali café" → "cafe".
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Round-trips the section array back into the textarea format staff edit. */
function toMarkdownish(post?: BlogPost) {
  if (!post) return "";
  return post.sections
    .map((section) =>
      [section.heading ? `## ${section.heading}` : null, ...section.body]
        .filter(Boolean)
        .join("\n\n"),
    )
    .join("\n\n");
}

const field =
  "w-full rounded-[var(--radius-xs)] border border-mist/20 bg-ink px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-gold";
const label = "mb-2 block text-xs font-medium text-mist";

function Save({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-gold px-6 py-2.5 text-xs font-medium text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Saving…" : editing ? "Save changes" : "Create post"}
    </button>
  );
}

export default function PostEditor({ post }: { post?: BlogPost }) {
  const [state, action] = useActionState<ActionState, FormData>(savePost, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  // Once a post exists its slug is its URL, so it stops following the title.
  const [slugTouched, setSlugTouched] = useState(Boolean(post));

  const editing = Boolean(post);

  return (
    <form action={action} className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <input type="hidden" name="original_slug" value={post?.slug ?? ""} />

      <div className="space-y-4 rounded-[var(--radius-md)] border border-mist/12 bg-ink p-5">
        <div>
          <label htmlFor="title" className={label}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className={label}>
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            required
            defaultValue={post?.excerpt ?? ""}
            placeholder="The one or two sentences that appear on the journal index."
            className={`${field} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="body" className={label}>
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={20}
            defaultValue={toMarkdownish(post)}
            placeholder={"## A section heading\n\nA paragraph.\n\nAnother paragraph."}
            className={`${field} resize-y font-mono text-[0.8rem] leading-relaxed`}
          />
          <p className="mt-1.5 text-[0.7rem] text-muted">
            Blank line between paragraphs. A line starting with{" "}
            <code className="font-mono">##</code> starts a new section heading.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-[var(--radius-md)] border border-mist/12 bg-ink p-5 lg:sticky lg:top-8">
        <div>
          <label htmlFor="slug" className={label}>
            URL slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            readOnly={editing}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={`${field} font-mono text-xs ${editing ? "text-muted" : ""}`}
          />
          <p className="mt-1.5 text-[0.7rem] text-muted">
            {editing
              ? "Fixed once published — changing it would break existing links."
              : `/blog/${slug || "…"}`}
          </p>
        </div>

        <div>
          <label htmlFor="category" className={label}>
            Category
          </label>
          <input
            id="category"
            name="category"
            defaultValue={post?.category ?? "News"}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="author" className={label}>
            Author
          </label>
          <input
            id="author"
            name="author"
            defaultValue={post?.author ?? "Linker World Travel"}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="read_time" className={label}>
            Read time
          </label>
          <input
            id="read_time"
            name="read_time"
            defaultValue={post?.read_time ?? "5 min read"}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="tags" className={label}>
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={post?.tags.join(", ") ?? ""}
            placeholder="Comma separated"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="hero_image" className={label}>
            Hero image path
          </label>
          <input
            id="hero_image"
            name="hero_image"
            defaultValue={post?.hero_image ?? ""}
            placeholder="/img/hero-savanna.png"
            className={`${field} font-mono text-xs`}
          />
        </div>

        <label className="flex items-center gap-3 border-t border-mist/12 pt-4 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
            className="size-4 accent-[var(--color-gold)]"
          />
          Published
        </label>

        <div className="flex items-center gap-3">
          <Save editing={editing} />
          {state.error && (
            <span role="alert" className="text-xs text-ember">
              {state.error}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
