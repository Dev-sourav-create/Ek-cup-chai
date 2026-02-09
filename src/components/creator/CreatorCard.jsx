import Link from "next/link";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";

export default function CreatorCard({ creator }) {
  const displayName =
    creator.firstname || creator.lastname
      ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
      : creator.username || "Creator";

  return (
    <article
      className="rounded-4xl border border-black/5 bg-white p-6 transition dark:border-white/10 dark:bg-zinc-900"
      aria-label={`Profile for ${displayName}`}
    >
      <div className="flex flex-col gap-6 text-left">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-400">
            About
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {displayName}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {creator.bio?.trim()
              ? creator.bio
              : "This creator has not added a bio yet."}
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-black/5 pt-4 dark:border-white/10">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            <LinkedInLogoIcon height={20} width={20} />
            Follow
          </Link>
        </div>
      </div>
    </article>
  );
}
