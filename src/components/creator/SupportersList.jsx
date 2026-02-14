import { Heart } from "lucide-react";

// Placeholder until we have a supporters/tips model
const PLACEHOLDER_SUPPORTERS = [];

const formatAmount = (amount) => {
  if (typeof amount !== "number") return "N/A";

  return `INR ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

export default function SupportersList({
  supporters = PLACEHOLDER_SUPPORTERS,
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
      {/* Header */}
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        <Heart className="h-4 w-4 text-pink-500" />
        Recent Supporters
      </h2>

      {/* Empty State */}
      {supporters.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No supporters yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {supporters.map((s, i) => (
            <li
              key={s.id ?? i}
              className="group flex flex-col gap-1 rounded-xl bg-black/5 px-4 py-3 transition hover:-translate-y-0.2 hover:bg-pink-50 dark:bg-white/5"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {s.isPrivate ? "Private supporter" : s.name || "Anonymous"}
                </span>

                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {formatAmount(s.amount)}
                </span>
              </div>

              {/* Message */}
              {!s.isPrivate && s.message ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {s.message}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
