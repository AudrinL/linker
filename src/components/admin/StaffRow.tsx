"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateStaffMember, type ActionState } from "@/app/admin/actions";
import type { AccountStatus, Role } from "@/lib/admin/session";

export type StaffMember = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  status: AccountStatus;
  created_at: string;
};

const STATUS_TONE: Record<AccountStatus, string> = {
  pending: "bg-gold/12 text-gold",
  approved: "bg-verdant/15 text-verdant",
  suspended: "bg-ember/10 text-ember",
};

function Action({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-mist/20 px-3.5 py-1.5 text-[0.7rem] transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

/** One row, with the actions that make sense for the state it is in. */
export default function StaffRow({
  member,
  isSelf,
}: {
  member: StaffMember;
  isSelf: boolean;
}) {
  const [state, action] = useActionState<ActionState, FormData>(
    updateStaffMember,
    {},
  );

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {member.full_name ?? member.email}
          {isSelf && <span className="ml-2 text-[0.7rem] text-muted">(you)</span>}
        </p>
        <p className="truncate text-xs text-muted">{member.email}</p>
      </div>

      <span className="text-xs text-mist">
        {member.role === "super_admin" ? "Super admin" : "Staff"}
      </span>

      <span
        className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${STATUS_TONE[member.status]}`}
      >
        {member.status === "pending"
          ? "Pending"
          : member.status === "approved"
            ? "Approved"
            : "Suspended"}
      </span>

      {/* Your own row has no controls — locking yourself out is a one-way trip
          that only a SQL statement can undo. */}
      {isSelf ? (
        <span className="text-[0.7rem] text-muted">—</span>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {member.status !== "approved" && (
            <form action={action}>
              <input type="hidden" name="id" value={member.id} />
              <input type="hidden" name="status" value="approved" />
              <Action label={member.status === "pending" ? "Approve" : "Restore"} />
            </form>
          )}

          {member.status === "approved" && (
            <form action={action}>
              <input type="hidden" name="id" value={member.id} />
              <input type="hidden" name="status" value="suspended" />
              <Action label="Suspend" />
            </form>
          )}

          <form action={action}>
            <input type="hidden" name="id" value={member.id} />
            <input
              type="hidden"
              name="role"
              value={member.role === "super_admin" ? "staff" : "super_admin"}
            />
            <Action
              label={member.role === "super_admin" ? "Make staff" : "Make super admin"}
            />
          </form>
        </div>
      )}

      {state.error && (
        <p role="alert" className="w-full text-xs text-ember">
          {state.error}
        </p>
      )}
    </li>
  );
}
