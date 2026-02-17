"use client";

import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import React, { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateUserInfo } from "@/store/slices/userSlice";

export const CoverImageSection = ({ creator }) => {
  const dispatch = useAppDispatch();

  const [uploadedCoverImage, setUploadedCoverImage] = useState(
    creator.coverImage || "",
  );

  const imageUrl = uploadedCoverImage || creator.coverImage;

  return (
    <div className="relative w-full flex items-center justify-center h-[220px] md:h-[320px] lg:h-[380px] xl:h-[420px] bg-gradient-to-r from-amber-100 via-orange-50 to-rose-100 overflow-hidden">
      {/* IMAGE */}
      {imageUrl && (
        <Image src={imageUrl} fill alt="cover" className="object-cover" />
      )}

      {/* UPLOAD BUTTON */}
      <CldUploadButton
        signatureEndpoint="/api/cloudinary-signature"
        options={{
          folder: "ekcupchai/cover-images",
        }}
        onSuccess={(result) => {
          const imageUrl = result.info.secure_url;

          setUploadedCoverImage(imageUrl);

          dispatch(
            updateUserInfo({
              coverImage: imageUrl,
            }),
          );
        }}
      >
        <span className="absolute  top-4 right-4 z-10 px-4 py-2 text-sm font-medium bg-white/90 backdrop-blur border border-gray-300 rounded-full shadow-sm hover:bg-white transition">
          Change cover
        </span>
      </CldUploadButton>
    </div>
  );
};
