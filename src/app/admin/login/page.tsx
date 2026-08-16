import Image from "next/image";
import { redirect } from "next/navigation";
import { allowlist, hasSession, passwordLoginAllowed } from "@/lib/admin/session";
import { supabaseConfigured } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Already signed in — no reason to show the form again.
  if (await hasSession()) redirect("/admin");

  const { error } = await searchParams;

  // Supabase wins wherever it is configured; the password form only appears
  // when it is not, and then only outside production.
  // Supabase configured but no allowlist means every sign-in would be refused
  // after the round trip. Say so here rather than emailing a link that leads
  // to a locked door.
  const mode = supabaseConfigured()
    ? allowlist().length > 0
      ? "supabase"
      : "no-allowlist"
    : passwordLoginAllowed()
      ? "password"
      : "unconfigured";

  return (
    <div className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/img/logo.jpeg"
            alt=""
            width={56}
            height={56}
            className="size-14 rounded-2xl object-contain"
            priority
          />
          <h1 className="mt-5 font-display text-2xl">Staff dashboard</h1>
          <p className="mt-2 text-sm text-muted">
            {site.name} — applications, inquiries and the journal.
          </p>
        </div>

        <div className="glass rounded-[var(--radius-lg)] p-7">
          <LoginForm mode={mode} linkError={error === "link"} />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          This area is for {site.shortName} staff. Everything here is client
          data — do not share screenshots outside the office.
        </p>
      </div>
    </div>
  );
}
