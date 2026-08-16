"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUp, type ActionState } from "@/app/admin/actions";

const field =
  "w-full rounded-[var(--radius-xs)] border border-mist/20 bg-ink px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
const label = "mb-2 block text-xs font-medium text-mist";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Creating…" : "Create my account"}
    </button>
  );
}

export default function SignUpForm() {
  const [state, action] = useActionState<ActionState, FormData>(signUp, {});

  if (state.ok) {
    return (
      <div className="text-center">
        <h2 className="font-display text-lg">Account created</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Confirm your email address using the message we just sent, then wait
          for an administrator to approve you. You will not be able to see
          anything until they do.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="full_name" className={label}>
          Full name
        </label>
        <input id="full_name" name="full_name" required autoFocus className={field} />
      </div>

      <div>
        <label htmlFor="email" className={label}>
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={field}
        />
      </div>

      <div>
        <label htmlFor="password" className={label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className={field}
        />
        <p className="mt-1.5 text-[0.7rem] text-muted">
          At least 12 characters. Three or four unrelated words work well.
        </p>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-ember">
          {state.error}
        </p>
      )}

      <Submit />

      <p className="text-center text-[0.7rem] leading-relaxed text-muted">
        Creating an account does not grant access. An administrator approves
        each one before it can see any client information.
      </p>
    </form>
  );
}
