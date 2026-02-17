"use client";

import { useEffect } from "react";
import CreatorCard from "@/components/creator/CreatorCard";
import QRCard from "@/components/creator/QRCard";
import SupportersList from "@/components/creator/SupportersList";
import { useCreator, useSupporters, useAppDispatch } from "@/store/hooks";
import { fetchCreatorByUsername } from "@/store/slices/creatorSlice";
import { fetchSupporters } from "@/store/slices/supportersSlice";

export default function CreatorPageClient({ username, initialCreator, initialSupporters }) {
  const dispatch = useAppDispatch();
  const creatorState = useCreator();
  const supportersState = useSupporters();

  useEffect(() => {
    // Load creator into Redux if not already loaded
    if (username && (!creatorState.viewedCreator || creatorState.viewedCreator.username !== username)) {
      dispatch(fetchCreatorByUsername(username));
    }
  }, [username, creatorState.viewedCreator, dispatch]);

  useEffect(() => {
    // Load supporters into Redux
    const creator = creatorState.viewedCreator || initialCreator;
    if (creator?._id && !supportersState.supporters.length) {
      dispatch(
        fetchSupporters({
          creatorId: creator._id,
          limit: 8,
        })
      );
    }
  }, [creatorState.viewedCreator, initialCreator, supportersState.supporters.length, dispatch]);

  // Use Redux state if available, otherwise fall back to initial props
  const creator = creatorState.viewedCreator || initialCreator;
  const supporters = supportersState.supporters.length > 0 
    ? supportersState.supporters 
    : initialSupporters;

  if (!creator) return null;

  const displayName =
    creator.firstname || creator.lastname
      ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
      : creator.username;

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <aside className="lg:sticky lg:top-28">
          <CreatorCard creator={creator} />
        </aside>

        <div className="flex flex-col gap-6">
          <QRCard
            upiId={creator.upiId}
            creatorName={displayName}
            creatorUsername={creator.username}
            qrImageUrl={creator.qrImageUrl}
          />

          <SupportersList supporters={supporters} />
        </div>
      </div>
    </>
  );
}
