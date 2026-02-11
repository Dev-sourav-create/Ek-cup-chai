import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import { redirect } from "next/navigation";
import { Coffee, Heart, ArrowRight } from "lucide-react";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    await dbConnect();
    const userDb = await User.findOne({ clerkUserId: user.id });
    if (userDb && !userDb.onboardingCompleted) {
      redirect("/complete-your-page");
    }
    if (userDb?.username) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 font-poppins">
      <section className="flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Ek Cup Chai"
              width={64}
              height={64}
              className="object-contain"
            />
            <h1 className="font-pacifico text-4xl tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              Ek Cup Chai
            </h1>
          </div>
          <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Support your favourite creators with UPI. One chai at a time.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-chaiBrown px-6 py-3 font-medium text-white transition hover:scale-[1.02] hover:opacity-90"
          >
            Get started <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 rounded-full bg-black/5 px-6 py-3 font-medium text-zinc-900 transition hover:bg-black/10 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/20"
          >
            Log in
          </Link>
        </div>

        <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
            <Coffee className="mx-auto mb-3 h-10 w-10 text-chaiBrown" aria-hidden />
            <h2 className="mb-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              For creators
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Set up your page in minutes. Share your UPI or QR. Get supported.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
            <Heart className="mx-auto mb-3 h-10 w-10 text-chaiBrown" aria-hidden />
            <h2 className="mb-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              For fans
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Find creators you love. Pay with UPI. No signup needed to support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
