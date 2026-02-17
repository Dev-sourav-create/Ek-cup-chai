"use client";
import { UserButton } from "@clerk/nextjs";
import React, { useState } from "react";
import EditCreatorDetailForm from "@/app/(protected)/components/EditCreatorDetailForm";
import { useUser, useCreator } from "@/store/hooks";

export const Header = () => {
  const [editOpen, setEditOpen] = useState(false);
  const user = useUser();
  const creatorState = useCreator();
  const creator = creatorState.currentCreator || user.dbUser;

  if (!creator) return null;

  const displayName =
    creator.firstname || creator.lastname
      ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
      : creator.username || "Creator";

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200">
      <div className="mx-auto  flex items-center justify-between px-12 py-5">
        {/* LEFT: Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-zinc-200">
            {creator.imageUrl && (
              <img
                src={creator.imageUrl}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <h1 className="text-lg font-semibold">{displayName}</h1>
        </div>

        {/* RIGHT: Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2 font-medium">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 rounded-full border border-gray-200 hover:bg-zinc-100 transition-colors bg-white/80 px-4 py-2.5 text-sm"
            >
              Edit page
            </button>
            <button className="flex items-center gap-2  rounded-full bg-pink-600 px-4 py-2 text-sm text-white">
              + Create
            </button>
          </div>
          <UserButton />
        </div>
        {editOpen && (
          <EditCreatorDetailForm onClose={() => setEditOpen(false)} />
        )}
      </div>
    </div>
  );
};
