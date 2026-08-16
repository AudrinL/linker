import { formatDate } from "@/lib/admin/format";

/**
 * Fourteen days of submissions.
 *
 * Deliberately a bare bar chart with no axis furniture: the question it
 * answers is "is work arriving, and is today unusual", which reads off the
 * shape alone. The table beneath it is the accessible equivalent — screen
 * readers get the numbers, not a shrug.
 */
export default function TrendBars({ days }: { days: Record<string, number> }) {
  const entries = Object.entries(days);
  const peak = Math.max(1, ...entries.map(([, count]) => count));
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <figure className="m-0">
      <figcaption className="mb-4 flex items-baseline justify-between">
        <span className="text-xs font-medium text-mist">Last 14 days</span>
        <span className="text-xs text-muted">
          {total} submission{total === 1 ? "" : "s"}
        </span>
      </figcaption>

      <div className="flex h-24 items-end gap-1.5" aria-hidden>
        {entries.map(([date, count]) => (
          <div
            key={date}
            title={`${formatDate(date)}: ${count}`}
            className="flex-1 rounded-t-[3px] bg-gold/70 transition-colors hover:bg-gold"
            // A zero day still gets a hairline, so the axis stays readable and
            // "nothing arrived" is visibly different from "no data".
            style={{ height: `${Math.max(2, (count / peak) * 100)}%` }}
          />
        ))}
      </div>

      <table className="sr-only">
        <caption>Submissions received per day over the last 14 days</caption>
        <tbody>
          {entries.map(([date, count]) => (
            <tr key={date}>
              <th scope="row">{formatDate(date)}</th>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
