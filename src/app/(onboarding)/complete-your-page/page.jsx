"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import UsernameInput from "@/components/ui/UsernameInput";

const COUNTRIES = [
  { value: "", label: "Select country" },
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "AE", label: "UAE" },
  { value: "SG", label: "Singapore" },
  { value: "OTHER", label: "Other" },
];

export default function CompleteYourPage() {
  const { user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [upiId, setUpiId] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleUsernameChange = useCallback((value) => {
    setUsername(value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || username.length < 2) {
      setError("Choose a username (at least 2 characters).");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/users/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          bio: bio.trim(),
          country: country || undefined,
          upiId: upiId.trim() || undefined,
          qrImageUrl: qrImageUrl.trim() || undefined,
          imageUrl: user?.imageUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12 font-poppins">
      <h1 className="mb-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Complete your page
      </h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Set up your creator profile so fans can find you and support you.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Profile image (from Clerk) */}
        {user?.imageUrl && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Profile photo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                We use your Clerk profile photo. You can change it in your account settings.
              </p>
            </div>
          </div>
        )}

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Username
          </label>
          <UsernameInput
            value={username}
            onChange={handleUsernameChange}
            prefix="ekcupchai/"
            placeholder="yourname"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="bio"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short intro for your supporters…"
            rows={4}
            className="w-full resize-none rounded-xl border border-black/5 bg-black/5 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-chaiBrown/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-chaiBrown/30 dark:border-white/10 dark:bg-white/10 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="country"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-black/5 bg-black/5 px-4 py-3 text-zinc-900 focus:border-chaiBrown/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-chaiBrown/30 dark:border-white/10 dark:bg-white/10 dark:text-zinc-100 dark:focus:bg-zinc-900"
          >
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* UPI ID */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="upiId"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            UPI ID
          </label>
          <input
            id="upiId"
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            className="w-full rounded-xl border border-black/5 bg-black/5 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-chaiBrown/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-chaiBrown/30 dark:border-white/10 dark:bg-white/10 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Fans will use this to send you payments via UPI.
          </p>
        </div>

        {/* QR image URL (optional) */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="qrImageUrl"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            QR code image URL <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="qrImageUrl"
            type="url"
            value={qrImageUrl}
            onChange={(e) => setQrImageUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-xl border border-black/5 bg-black/5 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-chaiBrown/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-chaiBrown/30 dark:border-white/10 dark:bg-white/10 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Link to your UPI QR image if you prefer to show a QR instead of UPI ID.
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-chaiBrown px-6 py-3 font-medium text-white transition hover:scale-[1.02] hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Complete setup"}
        </button>
      </form>
    </div>
  );
}
