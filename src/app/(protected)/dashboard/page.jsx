import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import { redirect } from "next/navigation";
import { ExternalLink, Coffee, Settings } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  await dbConnect();
  const userDb = await User.findOne({ clerkUserId: user.id });
  if (!userDb || !userDb.onboardingCompleted) redirect("/complete-your-page");

  const displayName =
    userDb.firstname || userDb.lastname
      ? [userDb.firstname, userDb.lastname].filter(Boolean).join(" ")
      : userDb.username || "Creator";
  const pageUrl = userDb.username
    ? `/ekcupchai/${userDb.username}`
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 font-poppins">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Your page card */}
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800">
              {userDb.imageUrl ? (
                <Image
                  src={userDb.imageUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-chaiBrown">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Your creator page
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {userDb.username ? (
                  <>ekcupchai/{userDb.username}</>
                ) : (
                  "Complete onboarding to get your page."
                )}
              </p>
              {pageUrl && (
                <Link
                  href={pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-chaiBrown px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:opacity-90"
                >
                  View page <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
          <h2 className="mb-4 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Quick actions
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/complete-your-page"
              className="flex items-center gap-3 rounded-xl border border-black/5 bg-black/5 px-4 py-3 transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <Settings className="h-5 w-5 text-chaiBrown" aria-hidden />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                Edit profile & UPI
              </span>
            </Link>
            {pageUrl && (
              <Link
                href={pageUrl}
                className="flex items-center gap-3 rounded-xl border border-black/5 bg-black/5 px-4 py-3 transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <Coffee className="h-5 w-5 text-chaiBrown" aria-hidden />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  Preview your page
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Placeholder for future: supporters, earnings */}
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <h2 className="mb-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Recent activity
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Supporters and payments will appear here once you receive them.
        </p>
      </div>
    </div>
  );
}
