import { redirect } from "next/navigation";
import { currentStaff } from "@/lib/admin/session";
import { logout } from "@/app/admin/actions";

/**
 * Where an account waits.
 *
 * Two very different situations share this screen, and the copy distinguishes
 * them: a new account waiting for approval, and one that has been suspended.
 * Neither can see any client data.
 */
export default async function PendingPage() {
  const staff = await currentStaff();
  if (!staff) redirect("/admin/login");
  if (staff.status === "approved") redirect("/admin");

  const suspended = staff.status === "suspended";

  return (
    <div className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-2xl">
          {suspended ? "Access suspended" : "Waiting for approval"}
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
          {suspended
            ? "This account no longer has access to the dashboard. If you think that is a mistake, speak to an administrator."
            : "Your account has been created but an administrator has not approved it yet. You will be able to sign in as soon as they do."}
        </p>

        <p className="mt-6 text-xs text-muted">Signed in as {staff.email}</p>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="rounded-full border border-mist/20 px-5 py-2.5 text-xs transition-colors hover:border-gold hover:text-gold"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
