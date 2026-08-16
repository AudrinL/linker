"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, sendMagicLink, type ActionState } from "@/app/admin/actions";

const field =
  "w-full rounded-[var(--radius-xs)] border border-mist/20 bg-ink px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

function Submit({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-gold px-6 py-3 text-sm font-medium text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
    >
      {pending ? busy : idle}
    </button>
  );
}

/** Supabase magic link — the production path. */
function MagicLinkForm() {
  const [state, action] = useActionState<ActionState, FormData>(sendMagicLink, {});

  if (state.ok) {
    return (
      <div className="text-center">
        <h2 className="font-display text-lg">Check your email</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          If that address belongs to a staff account, a sign-in link is on its
          way. It expires shortly and can only be used once.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-medium text-mist">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          placeholder="you@linkerworldtravel.com"
          className={field}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-ember">
          {state.error}
        </p>
      )}

      <Submit idle="Email me a sign-in link" busy="Sending…" />

      <p className="text-center text-[0.7rem] leading-relaxed text-muted">
        No password needed. Accounts are created by an administrator — signing
        in never creates one.
      </p>
    </form>
  );
}

/** Shared-password fallback. Local development only; refused in production. */
function PasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(login, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-medium text-mist">
          Dashboard password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className={field}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-ember">
          {state.error}
        </p>
      )}

      <Submit idle="Sign in" busy="Checking…" />

      <p className="rounded-[var(--radius-xs)] bg-gold/10 px-3 py-2 text-center text-[0.7rem] leading-relaxed text-gold">
        Local development mode — Supabase is not configured, so this shared
        password is standing in. It does not work in production.
      </p>
    </form>
  );
}

export default function LoginForm({
  mode,
  linkError,
}: {
  mode: "supabase" | "password" | "no-allowlist" | "unconfigured";
  linkError?: boolean;
}) {
  return (
    <div className="space-y-4">
      {linkError && (
        <p role="alert" className="text-sm text-ember">
          That sign-in link has expired or was already used. Request a new one.
        </p>
      )}

      {mode === "supabase" && <MagicLinkForm />}
      {mode === "password" && <PasswordForm />}
      {mode === "no-allowlist" && (
        <p className="text-sm leading-relaxed text-muted">
          Sign-in is locked. No staff addresses are configured, so every account
          would be refused. Set
          <code className="mx-1 font-mono text-xs">ADMIN_EMAILS</code>
          to the comma-separated staff addresses and redeploy.
        </p>
      )}
      {mode === "unconfigured" && (
        <p className="text-sm leading-relaxed text-muted">
          Sign-in is not configured for this deployment. Set
          <code className="mx-1 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code>
          and
          <code className="mx-1 font-mono text-xs">
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          </code>
          , then redeploy.
        </p>
      )}
    </div>
  );
}
