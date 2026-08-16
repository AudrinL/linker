import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentStaff, passwordLoginAllowed } from "@/lib/admin/session";
import { supabaseConfigured, supabaseEnvDiagnosis } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Already signed in — send them where they belong rather than showing the
  // form again. A pending account goes to the waiting screen, not the inbox.
  const staff = await currentStaff();
  if (staff) redirect(staff.status === "approved" ? "/admin" : "/admin/pending");

  const { error } = await searchParams;

  // Supabase wins wherever it is configured; the password form only appears
  // when it is not, and then only outside production.
  const mode = supabaseConfigured()
    ? "supabase"
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
          <LoginForm
            mode={mode}
            linkError={error === "link"}
            // Only computed for the screen that needs it — the working sign-in
            // paths never see it.
            diagnosis={mode === "unconfigured" ? supabaseEnvDiagnosis() : undefined}
          />
        </div>

        {mode === "supabase" && (
          <p className="mt-6 text-center text-xs text-muted">
            No account yet?{" "}
            <Link href="/admin/signup" className="text-gold hover:underline">
              Request one
            </Link>
          </p>
        )}

        <p className="mt-4 text-center text-xs text-muted">
          This area is for {site.shortName} staff. Everything here is client
          data — do not share screenshots outside the office.
        </p>
      </div>
    </div>
  );
}
