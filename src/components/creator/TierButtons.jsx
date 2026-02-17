import { Coffee } from "lucide-react";

const TIERS = [
  { label: "Chai", amount: "₹49", desc: "One cup of chai" },
  { label: "Coffee", amount: "₹99", desc: "One cup of coffee" },
  { label: "Meal", amount: "₹199", desc: "A meal on you" },
];

export default function TierButtons() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Support tiers
      </h2>
      <div className="flex flex-col gap-3">
        {TIERS.map((tier) => (
          <button
            key={tier.label}
            type="button"
            className="flex items-center justify-between rounded-xl border border-black/5 bg-black/5 px-4 py-3 text-left transition hover:scale-[1.01] hover:border-chaiBrown/30 hover:bg-chaiBrown/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-chaiBrown/10"
          >
            <span className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <Coffee className="h-4 w-4 text-chaiBrown" aria-hidden />
              {tier.label}
            </span>
            <span className="text-sm font-semibold text-chaiBrown">
              {tier.amount}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
