"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { inviteStaff, type ActionState } from "@/app/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-gold px-5 py-2.5 text-xs font-medium text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Adding…" : "Add account"}
    </button>
  );
}

/**
 * Registers a colleague and the role they should hold.
 *
 * They finish by setting their own password at the sign-up link, which is why
 * this shows the link to send them rather than pretending an email went out —
 * sending invitation mail needs a privileged key this app deliberately does
 * not hold.
 */
export default function InviteForm({ signupUrl }: { signupUrl: string }) {
  const [state, action] = useActionState<ActionState, FormData>(inviteStaff, {});
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(signupUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-[var(--radius-md)] border border-mist/12 bg-ink p-5">
      <h2 className="mb-1 text-xs font-medium text-mist">Add an account</h2>
      <p className="mb-4 text-[0.7rem] leading-relaxed text-muted">
        They sign up with this address and are approved automatically, with the
        role you choose.
      </p>

      <form action={action} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[14rem] flex-1">
          <label htmlFor="invite-email" className="mb-2 block text-xs text-mist">
            Email address
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="colleague@linkerworldtravel.com"
            className="w-full rounded-[var(--radius-xs)] border border-mist/20 bg-abyss px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="invite-role" className="mb-2 block text-xs text-mist">
            Role
          </label>
          <select
            id="invite-role"
            name="role"
            defaultValue="staff"
            className="rounded-[var(--radius-xs)] border border-mist/20 bg-abyss px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-gold"
          >
            <option value="staff">Staff</option>
            <option value="super_admin">Super admin</option>
          </select>
        </div>

        <Submit />
      </form>

      {state.error && (
        <p role="alert" className="mt-3 text-xs text-ember">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p className="mt-3 text-xs text-verdant">
          Added. Send them the sign-up link to finish.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-mist/10 pt-4">
        <code className="min-w-0 flex-1 truncate font-mono text-[0.7rem] text-muted">
          {signupUrl}
        </code>
        <button
          type="button"
          onClick={copy}
          className="rounded-full border border-mist/20 px-3.5 py-1.5 text-[0.7rem] transition-colors hover:border-gold hover:text-gold"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
