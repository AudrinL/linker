import Link from "next/link";
import { redirect } from "next/navigation";
import { currentStaff } from "@/lib/admin/session";
import { supabaseConfigured } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import SignUpForm from "@/components/admin/SignUpForm";

export default async function SignUpPage() {
  if (!supabaseConfigured()) redirect("/admin/login");

  // Already has an account — send them wherever they belong.
  const staff = await currentStaff();
  if (staff) redirect(staff.status === "approved" ? "/admin" : "/admin/pending");

  return (
    <div className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl">Request an account</h1>
          <p className="mt-2 text-sm text-muted">
            {site.name} staff dashboard
          </p>
        </div>

        <div className="glass rounded-[var(--radius-lg)] p-7">
          <SignUpForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/admin/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
