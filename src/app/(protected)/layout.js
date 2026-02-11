import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default async function ProtectedLayout({ children }) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  await dbConnect();

  const user = await User.findOne({ clerkUserId: userId });

  if (!user?.onboardingCompleted) {
    redirect("/complete-your-page");
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* NAVBAR — FULL WIDTH */}
      <Navbar />

      {/* BELOW NAVBAR */}
      <div className="flex w-full">
        {/* SIDEBAR */}
        <Sidebar />

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
