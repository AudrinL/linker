import { redirect } from "next/navigation";
import { currentStaff } from "@/lib/admin/session";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

/**
 * Deliberately outside the (dash) route group.
 *
 * The dashboard layout redirects here whenever a password still needs
 * changing; if this page lived inside that layout it would redirect to itself
 * forever.
 */
export default async function ChangePasswordPage() {
  const staff = await currentStaff();
  if (!staff) redirect("/admin/login");

  return (
    <div className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl">Choose a password</h1>
        <p className="mt-2 mb-7 text-sm text-muted">
          Signed in as {staff.email}
        </p>

        <div className="glass rounded-[var(--radius-lg)] p-7">
          <ChangePasswordForm forced={staff.mustChangePassword} />
        </div>
      </div>
    </div>
  );
}
