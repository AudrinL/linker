import type { Comparison } from "@/lib/services-data";
import { cn } from "@/lib/utils";

type ComparisonTableProps = {
  comparison: Comparison;
  className?: string;
};

/** Side-by-side comparison table with a gold highlight column. */
export function ComparisonTable({ comparison, className }: ComparisonTableProps) {
  const [columns, rows] = [comparison.columns, comparison.rows];
  return (
    <div className={cn("overflow-x-auto rounded-[var(--radius-lg)] border border-mist/15", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr>
            <th className="w-2/5 px-6 py-5 text-sm text-mist">{comparison.caption}</th>
            {columns.map((col, i) => (
              <th
                key={col}
                className={cn(
                  "px-6 py-5 font-display text-lg tracking-tight",
                  i === 1 ? "bg-gold/[0.08] text-gold" : "text-bone",
                )}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-mist/10">
              <th scope="row" className="px-6 py-4 text-sm font-medium tracking-tight text-bone">
                {row.label}
              </th>
              {row.values.map((v, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-6 py-4 text-sm leading-relaxed",
                    j === 1 ? "bg-gold/[0.05] font-medium text-bone" : "text-mist",
                  )}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
