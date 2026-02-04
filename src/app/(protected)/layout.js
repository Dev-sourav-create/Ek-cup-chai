import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";

export default async function ProtectedLayout({ children }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await dbConnect();

  const user = await User.findOne({ clerkUserId: userId });

  // ✅ REAL SOURCE OF TRUTH = DATABASE
  if (!user?.onboardingCompleted) {
    redirect("/complete-your-page");
  }

  return children;
}
