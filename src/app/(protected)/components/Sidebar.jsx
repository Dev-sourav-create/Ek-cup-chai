import Link from "next/link";
import { Home, Heart, Lock, ShoppingBag, Pencil, Settings } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import { redirect } from "next/navigation";
import { ExternalLink, Table2, Grip } from "lucide-react";

export default async function Sidebar() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  await dbConnect();

  const userDb = await User.findOne({ clerkUserId: user.id });
  if (!userDb || !userDb.onboardingCompleted) redirect("/complete-your-page");

  const displayName =
    userDb.firstname || userDb.lastname
      ? [userDb.firstname, userDb.lastname].filter(Boolean).join(" ")
      : userDb.username || "Creator";

  const pageUrl = userDb.username ? `/ekcupchai/${userDb.username}` : null;

  return (
    <aside className="hidden md:block h-screen w-64 border-r border-black/5 bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-900">
      <nav className="space-y-2 font-light text-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 w-full py-2.5 rounded-lg px-6 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Home size={18} /> Home
        </Link>

        {pageUrl && (
          <Link
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full py-2.5 rounded-lg px-6 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <span className="w-full flex items-center gap-3">
              <Table2 size={18} /> View page
            </span>
            <ExternalLink className="h-5 w-5" aria-hidden />
          </Link>
        )}

        <Link
          href="/explore"
          className="flex items-center gap-3 w-full py-2.5 rounded-lg px-6 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Grip size={18} /> Explore creators
        </Link>

        <p className="mt-6 text-xs uppercase text-zinc-400">Monetize</p>

        <Link
          href="#"
          className="flex items-center gap-3 w-full py-2.5 rounded-lg px-6 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Heart size={18} /> Supporters
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 w-full py-2.5 rounded-lg px-6 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Lock size={18} /> Memberships
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 w-full py-2.5 rounded-lg px-6 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <ShoppingBag size={18} /> Shop
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 w-full py-2.5 rounded-lg px-6 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Pencil size={18} /> Publish
        </Link>

        <p className="mt-6 text-xs uppercase text-zinc-400">Settings</p>

        <Link
          href="#"
          className="flex items-center gap-3 w-full py-2.5 rounded-lg px-6 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Settings size={18} /> Settings
        </Link>
      </nav>
    </aside>
  );
}
