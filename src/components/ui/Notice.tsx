import { cn } from "@/lib/utils";

type NoticeProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * The regulatory footnote that closes each service page.
 *
 * Every funnel on this site sells guidance, not outcomes — admissions, work
 * permits and visas are decided by third parties. This block states that
 * plainly wherever an applicant might otherwise read a promise into the copy,
 * so it is deliberately quiet in tone but never hidden.
 */
export function Notice({ title = "Important notice", children, className }: NoticeProps) {
  return (
    <aside
      className={cn(
        "rounded-[var(--radius-lg)] border border-ember/25 bg-ember/[0.05] p-7 sm:p-8",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <svg
          viewBox="0 0 24 24"
          className="size-5 shrink-0 stroke-ember"
          fill="none"
          strokeWidth="1.8"
          aria-hidden
        >
          <path d="M12 9v4.5M12 17h.01" strokeLinecap="round" />
          <path
            d="M10.3 3.9L2.5 17.4A2 2 0 004.2 20.4h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ember">
          {title}
        </h3>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-mist [&_strong]:font-medium [&_strong]:text-bone">
        {children}
      </div>
    </aside>
  );
}
