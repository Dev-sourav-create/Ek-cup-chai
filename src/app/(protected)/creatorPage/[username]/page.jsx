"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatorCard from "@/components/creator/CreatorCard";
import QRCard from "@/components/creator/QRCard";
import SupportersList from "@/components/creator/SupportersList";
import { Header } from "../components/Header";
import {
  useUser,
  useCreator,
  useSupporters,
  useAppDispatch,
} from "@/store/hooks";
import { fetchCurrentCreator } from "@/store/slices/creatorSlice";
import { fetchSupporters } from "@/store/slices/supportersSlice";
import { CoverImageSection } from "../components/CoverImageSection";

export default function PrivateCreatorPage({ params }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useUser();
  const creatorState = useCreator();
  const supportersState = useSupporters();

  useEffect(() => {
    // Fetch creator data
    if (!creatorState.currentCreator && user.isAuthenticated) {
      dispatch(fetchCurrentCreator());
    }
  }, [user.isAuthenticated, creatorState.currentCreator, dispatch, router]);

  useEffect(() => {
    // Fetch supporters when creator is loaded
    if (
      creatorState.currentCreator?._id &&
      !supportersState.supporters.length
    ) {
      dispatch(
        fetchSupporters({
          creatorId: creatorState.currentCreator._id,
          limit: 8,
        }),
      );
    }
  }, [
    creatorState.currentCreator,
    supportersState.supporters.length,
    dispatch,
  ]);

  // Show loading state
  if (!user.isAuthenticated || !creatorState.currentCreator) {
    return (
      <div className="w-full font-poppins flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  const creator = creatorState.currentCreator;
  const displayName =
    creator.firstname || creator.lastname
      ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
      : creator.username;

  console.log(creator);

  return (
    <div className="w-full font-poppins">
      {/* FULL WIDTH HEADER */}
      <Header />

      {/* FULL WIDTH COVER IMAGE */}
      <CoverImageSection creator={creator} />

      {/* MAIN CONTENT (OVERLAPPED) */}
      <div className="relative -mt-16 mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <aside className="lg:sticky lg:top-28">
            <CreatorCard editable />
          </aside>

          <div className="flex flex-col gap-6">
            <QRCard
              upiId={creator.upiId}
              creatorName={displayName}
              creatorUsername={creator.username}
              qrImageUrl={creator.qrImageUrl}
            />

            <SupportersList supporters={supportersState.supporters} />
          </div>
        </div>
      </div>
    </div>
  );
}
