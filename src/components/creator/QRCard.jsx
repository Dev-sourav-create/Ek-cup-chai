"use client";

import { useForm } from "react-hook-form";
import { HelpCircle, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import InputCheckBox from "@/app/(protected)/components/InputCheckBox";

const PRICE_PER_CHAI = 50;
const PRESETS = [1, 2, 5];

const formatAmount = (amount) =>
  `INR ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;

const isMobileDevice = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function QRCard({ upiId, creatorName, creatorUsername, qrImageUrl }) {
  const [upiLink, setUpiLink] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      name: "",
      message: "",
      private: false,
      chaiCount: 1,
    },
  });

  const chaiCount = watch("chaiCount");
  const amount = useMemo(() => Math.max(1, chaiCount || 1) * PRICE_PER_CHAI, [chaiCount]);

  useEffect(() => {
    if (!upiLink) {
      setQrDataUrl("");
      return;
    }
    QRCode.toDataURL(upiLink, { margin: 1, width: 220 })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(""));
  }, [upiLink]);

  const onSubmit = async (data) => {
    if (!creatorUsername) {
      setApiError("Creator username is missing.");
      return;
    }

    if (!upiId) {
      setApiError("This creator has not added a UPI ID yet.");
      return;
    }

    setApiError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/supporters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creatorUsername,
          name: data.name,
          message: data.message,
          isPrivate: data.private,
          chaiCount: Math.max(1, data.chaiCount || 1),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setApiError(payload.error || "Unable to start payment.");
        setIsSubmitting(false);
        return;
      }

      setUpiLink(payload.upiLink || "");
      reset({ ...data, message: "" });

      if (payload.upiLink && isMobileDevice()) {
        window.location.href = payload.upiLink;
      }
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900"
    >
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
        Buy a Chai
        <span className="group relative cursor-pointer">
          <HelpCircle className="h-4 w-4 opacity-60" />
          <span className="pointer-events-none absolute left-1/2 top-6 z-50 w-56 -translate-x-1/2 rounded-lg bg-black px-3 py-2 text-xs text-white opacity-0 transition group-hover:opacity-100">
            Each chai = INR 50. Choose how many chais you want to support.
          </span>
        </span>
      </h2>

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-pink-300 bg-pink-50 p-4 px-6 dark:bg-zinc-800">
        <span className="text-sm font-semibold text-pink-600">Chai</span>
        <span className="opacity-50">x</span>

        {PRESETS.map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setValue("chaiCount", n)}
            className={`h-11 w-11 rounded-full border text-sm font-semibold transition ${
              chaiCount === n
                ? "border-pink-600 bg-pink-600 text-white"
                : "border-pink-300 text-pink-600"
            }`}
          >
            {n}
          </button>
        ))}

        <input
          type="number"
          min={1}
          max={1000}
          {...register("chaiCount", { valueAsNumber: true })}
          className="ml-auto w-20 rounded-lg border border-zinc-300 bg-white py-2.5 text-center font-semibold text-zinc-800 focus:outline-none dark:bg-zinc-900"
        />
      </div>

      <input
        {...register("name")}
        placeholder="Name or @yoursocial"
        className="mb-3 w-full rounded-xl bg-[#f1f1f0] px-4 py-3 transition-all duration-300 placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-zinc-800"
      />

      <textarea
        {...register("message")}
        placeholder="Say something nice..."
        rows={4}
        className="mb-4 w-full resize-none rounded-xl bg-[#f1f1f0] px-4 py-3 transition-all duration-300 placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-zinc-800"
      />

      <div className="mb-6 space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <InputCheckBox {...register("private")} />
          Make this message private
        </label>
      </div>

      {apiError ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {apiError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || !upiId}
        className="w-full rounded-full bg-pink-600 py-4 font-semibold text-white transition-colors hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Starting payment..." : `Support ${formatAmount(amount)}`}
      </button>

      {!upiId ? (
        <p className="mt-3 text-sm text-zinc-500">
          This creator has not added a UPI ID yet.
        </p>
      ) : null}

      {upiLink || qrImageUrl ? (
        <div className="mt-6 rounded-xl border border-black/5 bg-white/40 p-4 text-center dark:border-white/10 dark:bg-zinc-900/40">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Scan to pay {creatorName ? `@ ${creatorName}` : ""}
          </p>
          <div className="mt-3 flex justify-center">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="UPI payment QR"
                className="h-44 w-44 rounded-lg border border-black/5 bg-white p-2 dark:border-white/10"
              />
            ) : qrImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrImageUrl}
                alt="Creator UPI QR"
                className="h-44 w-44 rounded-lg border border-black/5 bg-white p-2 dark:border-white/10"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-lg border border-dashed border-black/10 text-xs text-zinc-400 dark:border-white/10">
                QR will appear after you tap Support.
              </div>
            )}
          </div>
          {upiLink ? (
            <a
              href={upiLink}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-black/20 dark:border-white/10 dark:text-zinc-200"
            >
              Open UPI App <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
