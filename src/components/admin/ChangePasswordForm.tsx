"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changePassword, type ActionState } from "@/app/admin/actions";

const field =
  "w-full rounded-[var(--radius-xs)] border border-mist/20 bg-ink px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Set my password"}
    </button>
  );
}

export default function ChangePasswordForm({ forced }: { forced: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(changePassword, {});

  return (
    <form action={action} className="space-y-4">
      {forced && (
        <p className="rounded-[var(--radius-xs)] bg-gold/10 px-4 py-3 text-[0.8rem] leading-relaxed text-gold">
          Your account is still using the password it was set up with. Someone
          else knows that password, so choose your own before continuing.
        </p>
      )}

      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-medium text-mist">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          autoFocus
          className={field}
        />
        <p className="mt-1.5 text-[0.7rem] text-muted">
          At least 12 characters. A phrase of three or four unrelated words is
          easier to remember and harder to guess than a short scramble.
        </p>
      </div>

      <div>
        <label htmlFor="confirm" className="mb-2 block text-xs font-medium text-mist">
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className={field}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-ember">
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}
