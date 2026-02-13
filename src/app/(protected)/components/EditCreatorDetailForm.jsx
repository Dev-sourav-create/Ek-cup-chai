"use client";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import api from "@/lib/axio";
import { CldUploadButton } from "next-cloudinary";

export default function EditCreatorDetailForm({ creator, onClose, onSave }) {
  const [isopen, setisopen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(creator.imageUrl || "");

  if (typeof window === "undefined") return null;

  //theme colors
  const THEMES = [
    { id: "plum", label: "Plum Passion", color: "#6b21a8" },
    { id: "pink", label: "Pink Love", color: "#ec4899" },
    { id: "orange", label: "Sunset Orange", color: "#f97316" },
  ];

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullname:
        creator.firstname || creator.lastname
          ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
          : "",
      tagline: creator.tagline || "",
      bio: creator.bio || "",
      video: creator.video || "",
      themeColor: creator.themeColor || "plum",
      showSupporterCount: creator.showSupporterCount ?? true,
      coffeeName: creator.coffeeName || "chai",
    },
  });
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  async function submit(data) {
    try {
      const res = await api.patch("/users/updateUserInfo", {
        ...data,
        imageUrl: uploadedImage, // ⭐ send image
      });

      onSave(res.data.user);
      onClose();
    } catch (err) {
      console.log(err.response?.data?.error);
    }
  }

  return createPortal(
    <div className="fixed inset-0  z-9999 bg-black/40 flex justify-center overflow-y-auto">
      <form
        onSubmit={handleSubmit(submit)}
        className="relative m-6 w-full rounded-3xl bg-[#fffefe] dark:bg-zinc-900 flex flex-col overflow-hidden"
      >
        {/* HEADER (sticky) */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur dark:bg-zinc-900/80 px-8 py-5">
          <h2 className="text-lg font-semibold">Edit Page</h2>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 hover:bg-zinc-100 px-5 py-2 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-full bg-pink-600 hover:bg-pink-700 transition-colors px-6 py-2 text-white font-medium"
            >
              Save
            </button>
          </div>
        </div>

        {/* BODY (SCROLL AREA) */}
        <div className=" flex justify-center w-full overflow-y-auto px-12 py-10 space-y-10">
          <div className="lg:min-w-3xl px-12 py-10 space-y-10  ">
            {/* PROFILE PHOTO */}
            <section>
              <p className="mb-3 font-medium">Profile photo</p>

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-zinc-200">
                  {(uploadedImage || creator.imageUrl) && (
                    <Image
                      src={uploadedImage || creator.imageUrl}
                      fill
                      alt=""
                      className="object-cover"
                    />
                  )}
                </div>

                <CldUploadButton
                  signatureEndpoint="/api/cloudinary-signature"
                  options={{
                    folder: "ekcupchai/profile-images",
                  }}
                  onSuccess={(result) => {
                    setUploadedImage(result.info.secure_url);
                  }}
                />
              </div>
            </section>

            <hr className="text-gray-300" />

            {/* FULL NAME */}
            <section>
              <p className="mb-2 font-medium">Full name</p>
              <input
                {...register("fullname")}
                className="w-full rounded-xl bg-zinc-100 px-4 py-3 transition-all duration-300 placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </section>

            <hr className="text-gray-300" />

            {/* TAGLINE */}
            <section>
              <p className="mb-2 font-medium">What are you creating?</p>
              <input
                {...register("tagline")}
                className="w-full rounded-xl bg-zinc-100 px-4 py-3 transition-all duration-300 placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </section>

            <hr className="text-gray-300" />

            {/* BIO */}
            <section>
              <p className="mb-2 font-medium">About me</p>
              <textarea
                {...register("bio")}
                rows={5}
                className="w-full rounded-xl bg-zinc-100 transition-all duration-300 placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 px-4 py-3 outline-none"
              />
            </section>

            <hr className="text-gray-300" />

            {/* VIDEO */}
            <section>
              <p className="mb-2 font-medium">Featured video</p>
              <input
                {...register("video")}
                placeholder="Paste your YouTube or Vimeo link here"
                className="w-full rounded-xl bg-zinc-100 px-4 py-3 outline-none"
              />
            </section>

            <hr className="text-gray-300" />

            {/* THEME COLOR */}
            <section className="relative">
              <p className="mb-2 font-medium">Theme color</p>

              <button
                type="button"
                onClick={() => setisopen(!isopen)}
                className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2"
              >
                <span className="h-4 w-4 rounded-sm bg-purple-600"></span>
                Select theme
                <ChevronDown size={18} />
              </button>

              {isopen && (
                <ul className="absolute left-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-md">
                  {THEMES.map((t) => (
                    <li
                      key={t.id}
                      onClick={() => {
                        register("themeColor").onChange({
                          target: { value: t.id },
                        });
                        setisopen(false);
                      }}
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-zinc-100"
                    >
                      <span
                        className="h-4 w-4 rounded-sm"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.label}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <hr className="text-gray-300" />

            {/* TOGGLE */}
            <section className="flex pb-8 items-center justify-between">
              <p className="font-medium">Display supporter count</p>
              <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6.5 peer-checked:bg-black/90 rounded-full peer bg-slate-300 transition-colors duration-200"></div>
                <span className="dot absolute left-1 top-1 w-4.5 h-4.5 bg-white/95 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5.5"></span>
              </label>
            </section>
          </div>
        </div>
      </form>
    </div>,
    document.getElementById("modal-root"),
  );
}
