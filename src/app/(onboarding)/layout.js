import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default async function OnboardingLayout({ children }) {
  const { userId } = await auth();

  // login before onboarding
  if (!userId) {
    redirect("/sign-in");
  }

  await dbConnect();

  const user = await User.findOne({ clerkUserId: userId });

  // already onboarded go dashboard
  if (user?.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
