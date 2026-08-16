"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateRecord, type ActionState } from "@/app/admin/actions";
import { STATUSES, STATUS_LABELS, type Status } from "@/lib/admin/types";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-bone px-5 py-2.5 text-xs font-medium text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

/**
 * Status and the internal note, saved together.
 *
 * One save button rather than an auto-saving select: staff usually change the
 * status *and* write why, and splitting that into two writes would leave the
 * record briefly saying "rejected" with last week's note under it.
 */
export default function TriageForm({
  kind,
  id,
  status,
  note,
}: {
  kind: "applications" | "inquiries";
  id: string;
  status: Status;
  note?: string | null;
}) {
  const [state, action] = useActionState<ActionState, FormData>(updateRecord, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />

      <div>
        <label htmlFor="status" className="mb-2 block text-xs font-medium text-mist">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="w-full rounded-[var(--radius-xs)] border border-mist/20 bg-ink px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-gold"
        >
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="note" className="mb-2 block text-xs font-medium text-mist">
          Internal note
        </label>
        <textarea
          id="note"
          name="note"
          rows={5}
          defaultValue={note ?? ""}
          placeholder="Who spoke to them, what was agreed, what is outstanding."
          className="w-full resize-y rounded-[var(--radius-xs)] border border-mist/20 bg-ink px-3.5 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-gold"
        />
        <p className="mt-1.5 text-[0.7rem] text-muted">
          Staff only — the applicant never sees this.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Save />
        {state.error && (
          <span role="alert" className="text-xs text-ember">
            {state.error}
          </span>
        )}
        {state.ok && !state.error && (
          <span className="text-xs text-verdant">Saved.</span>
        )}
      </div>
    </form>
  );
}
