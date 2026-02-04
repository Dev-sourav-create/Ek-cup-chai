import { notFound } from "next/navigation";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import CreatorCard from "@/components/creator/CreatorCard";
import QRCard from "@/components/creator/QRCard";
import SupportersList from "@/components/creator/SupportersList";
import TierButtons from "@/components/creator/TierButtons";

export async function generateMetadata({ params }) {
  const { username } = await params;
  await dbConnect();
  const creator = await User.findOne({
    username: username?.toLowerCase(),
    onboardingCompleted: true,
  }).lean();

  if (!creator) return { title: "Creator not found | Ek Cup Chai" };

  const displayName =
    creator.firstname || creator.lastname
      ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
      : creator.username || "Creator";

  return {
    title: `${displayName} | Ek Cup Chai`,
    description: creator.bio || `Support ${displayName} on Ek Cup Chai`,
  };
}

export default async function CreatorPage({ params }) {
  const { username } = await params;
  if (!username) notFound();

  await dbConnect();
  const creator = await User.findOne({
    username: username.toLowerCase(),
    onboardingCompleted: true,
  }).lean();

  if (!creator) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 font-poppins">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        {/* Left: profile, bio, support buttons */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <CreatorCard creator={creator} />
        </aside>

        {/* Right: QR, supporters, tiers */}
        <div className="flex flex-col gap-6">
          <QRCard upiId={creator.upiId} qrImageUrl={creator.qrImageUrl} />
          <SupportersList />
          <TierButtons />
        </div>
      </div>
    </div>
  );
}
