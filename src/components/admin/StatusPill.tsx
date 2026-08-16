import { cn } from "@/lib/utils";
import { STATUS_LABELS, type Status } from "@/lib/admin/types";

/**
 * Colour carries meaning here, so each state also carries its own word — the
 * pill is never the only signal.
 */
const TONES: Record<Status, string> = {
  new: "bg-gold/12 text-gold",
  in_review: "bg-azure/12 text-azure",
  contacted: "bg-cyan/15 text-deep",
  approved: "bg-verdant/15 text-verdant",
  rejected: "bg-ember/10 text-ember",
  archived: "bg-mist/12 text-muted",
};

export default function StatusPill({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-medium whitespace-nowrap",
        TONES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
