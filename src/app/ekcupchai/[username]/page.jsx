import { notFound } from "next/navigation";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import Supporter from "@/models/supporterSchema";
import CreatorCard from "@/components/creator/CreatorCard";
import QRCard from "@/components/creator/QRCard";
import SupportersList from "@/components/creator/SupportersList";
import { ImageUp } from "lucide-react";

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

  const supporters = await Supporter.find({ creatorId: creator._id })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  const displayName =
    creator.firstname || creator.lastname
      ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
      : creator.username || "Creator";

  return (
    <div className="mx-auto max-w-6xl px-6 font-poppins">
      <div className="my-4 flex min-h-36 w-full items-center justify-between rounded-4xl bg-gradient-to-r from-amber-100 via-orange-50 to-rose-100 px-6 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Support
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            {displayName}
          </h1>
        </div>
        <span className="hidden items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-medium text-zinc-600 shadow-sm sm:inline-flex">
          <ImageUp size={16} /> Cover coming soon
        </span>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <CreatorCard creator={creator} />
        </aside>

        <div className="flex flex-col gap-6">
          <QRCard
            upiId={creator.upiId}
            creatorName={displayName}
            creatorUsername={creator.username}
            qrImageUrl={creator.qrImageUrl}
          />
          <SupportersList
            supporters={supporters.map((supporter) => ({
              id: supporter._id.toString(),
              name: supporter.name,
              message: supporter.message,
              amount: supporter.amount,
              isPrivate: supporter.isPrivate,
              createdAt: supporter.createdAt,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
