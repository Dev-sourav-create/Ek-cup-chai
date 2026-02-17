import CreatorCard from "./CreatorCard";
import QRCard from "./QRCard";
import SupportersList from "./SupportersList";
import CreatorControls from "./CreatorControls";

export default function CreatorLayout({
  creator,
  supporters,
  isOwner = false,
}) {
  const displayName =
    creator.firstname || creator.lastname
      ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
      : creator.username || "Creator";

  return (
    <div className="mx-auto max-w-6xl px-6 font-poppins">
      {/* Header */}
      <div className="my-4 flex min-h-36 w-full items-center justify-between rounded-4xl bg-linear-to-r from-amber-100 via-orange-50 to-rose-100 px-6 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Support
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            {displayName}
          </h1>
        </div>

        {/* PRIVATE ONLY */}
        {isOwner && <CreatorControls creator={creator} />}
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

          <SupportersList supporters={supporters} />
        </div>
      </div>
    </div>
  );
}
