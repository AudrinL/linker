import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentStaff, type Role } from "@/lib/admin/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/admin/format";
import { EmptyState, PageHeader, Panel } from "@/components/admin/Panel";
import StaffRow, { type StaffMember } from "@/components/admin/StaffRow";
import InviteForm from "@/components/admin/InviteForm";
import { revokeInvite } from "@/app/admin/actions";

type Invite = {
  email: string;
  role: Role;
  created_at: string;
  accepted_at: string | null;
};

export default async function UsersPage() {
  const me = await currentStaff();
  if (!me) redirect("/admin/login");
  // Staff accounts have no business here, and row-level security would return
  // them an empty list anyway — this just makes the boundary explicit.
  if (me.role !== "super_admin") redirect("/admin");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("staff")
    .select("id, email, full_name, role, status, created_at")
    .order("created_at", { ascending: false });

  // Outstanding invitations — accepted ones drop off, having become accounts.
  const { data: inviteRows } = await supabase
    .from("staff_invites")
    .select("email, role, created_at, accepted_at")
    .is("accepted_at", null)
    .order("created_at", { ascending: false });

  const invites = (inviteRows ?? []) as Invite[];

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const signupUrl = `${protocol}://${host}/admin/signup`;

  /**
   * Pending first — the whole point of this screen is the queue of people
   * waiting to be let in.
   *
   * Sorted here rather than in the query. `order("status")` sorts the column
   * alphabetically, which puts *approved* at the top and buries the queue; the
   * wanted order is by meaning, and PostgREST cannot express that. The list is
   * one row per member of staff, so sorting it in memory costs nothing.
   */
  const RANK: Record<string, number> = { pending: 0, approved: 1, suspended: 2 };
  const members = ((data ?? []) as StaffMember[])
    .slice()
    .sort(
      (a, b) =>
        (RANK[a.status] ?? 3) - (RANK[b.status] ?? 3) ||
        b.created_at.localeCompare(a.created_at),
    );

  const pending = members.filter((m) => m.status === "pending").length;

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={
          pending
            ? `${pending} account${pending === 1 ? "" : "s"} waiting for approval.`
            : "Everyone with an account on the dashboard."
        }
      />

      <div className="mb-4">
        <InviteForm signupUrl={signupUrl} />
      </div>

      {invites.length > 0 && (
        <Panel className="mb-4">
          <h2 className="border-b border-mist/12 px-5 py-3.5 text-xs font-medium text-mist">
            Waiting to sign up
          </h2>
          <ul className="divide-y divide-mist/10">
            {invites.map((invite) => (
              <li
                key={invite.email}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5"
              >
                <span className="min-w-0 flex-1 truncate text-sm">{invite.email}</span>
                <span className="text-xs text-mist">
                  {invite.role === "super_admin" ? "Super admin" : "Staff"}
                </span>
                <span className="text-xs text-muted">
                  added {formatDate(invite.created_at)}
                </span>
                <form action={revokeInvite}>
                  <input type="hidden" name="email" value={invite.email} />
                  <button
                    type="submit"
                    className="rounded-full border border-mist/20 px-3.5 py-1.5 text-[0.7rem] transition-colors hover:border-ember hover:text-ember"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {error ? (
        <div className="rounded-[var(--radius-md)] border border-ember/25 bg-ember/[0.05] p-6">
          <h2 className="text-sm font-medium text-ember">Could not load accounts</h2>
          <p className="mt-2 text-sm text-mist">{error.message}</p>
          <p className="mt-3 text-xs text-muted">
            If this mentions a missing table, run
            <code className="mx-1 font-mono">
              supabase/migrations/0001_staff_accounts.sql
            </code>
            in the Supabase SQL editor.
          </p>
        </div>
      ) : (
        <Panel>
          {members.length === 0 ? (
            <EmptyState>No accounts yet.</EmptyState>
          ) : (
            <ul className="divide-y divide-mist/10">
              {members.map((member) => (
                <StaffRow key={member.id} member={member} isSelf={member.id === me.id} />
              ))}
            </ul>
          )}
        </Panel>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted">
        A new account can see nothing until it is approved. Suspending keeps the
        record and its history but stops access on the next request — use it
        rather than deleting when someone leaves.
      </p>
    </>
  );
}
