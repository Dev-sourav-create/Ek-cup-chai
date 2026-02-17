import { notFound } from "next/navigation";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import Supporter from "@/models/supporterSchema";
import { ImageUp } from "lucide-react";
import CreatorPageClient from "./CreatorPageClient";

export async function generateMetadata({ params }) {
  const { username } = await params;

  await dbConnect();

  const creator = await User.findOne({
    username: username.toLowerCase(),
    onboardingCompleted: true,
  }).lean();

  if (!creator) return { title: "Creator not found | Ek Cup Chai" };

  const displayName =
    creator.firstname || creator.lastname
      ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
      : creator.username;

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
      : creator.username;

  return (
    <div className="mx-auto max-w-6xl px-6 font-poppins">
      {/* Header */}
      <div className="my-4 flex min-h-36 items-center justify-between rounded-4xl bg-linear-to-r from-amber-100 via-orange-50 to-rose-100 px-6 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Support
          </p>
          <h1 className="mt-2 text-2xl font-semibold">{displayName}</h1>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm shadow">
          <ImageUp size={16} /> Cover coming soon
        </span>
      </div>

      <CreatorPageClient
        username={username.toLowerCase()}
        initialCreator={{
          ...creator,
          _id: creator._id.toString(),
          createdAt: creator.createdAt?.toISOString?.() ?? null,
          updatedAt: creator.updatedAt?.toISOString?.() ?? null,
        }}
        initialSupporters={supporters.map((s) => ({
          id: s._id.toString(),
          name: s.name,
          message: s.message,
          amount: s.amount,
          isPrivate: s.isPrivate,
        }))}
      />
    </div>
  );
}
