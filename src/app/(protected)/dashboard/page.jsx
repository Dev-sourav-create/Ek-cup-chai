import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import { redirect } from "next/navigation";
import { Share, Heart, ArrowRight } from "lucide-react";
import DropDownMenu from "../components/DropDownMenu";
import { Footer } from "./component/Footer";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  await dbConnect();
  const userDb = await User.findOne({ clerkUserId: user.id });
  if (!userDb || !userDb.onboardingCompleted) redirect("/complete-your-page");

  const displayName =
    userDb.firstname || userDb.lastname
      ? [userDb.firstname, userDb.lastname].filter(Boolean).join(" ")
      : userDb.username || "Creator";
  const pageUrl = userDb.username ? `/ekcupchai/${userDb.username}` : null;

  return (
    <div className=" min-h-screen bg-zinc-100  dark:bg-zinc-950">
      {/* Top creator card */}
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8  dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-18 w-18 overflow-hidden rounded-full bg-zinc-200">
              {userDb.imageUrl ? (
                <Image
                  src={userDb.imageUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-semibold">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold">Hi, {displayName}</h2>
              {userDb.username && (
                <p className="text-sm text-zinc-500">
                  ekcupchai.com/{userDb.username}
                </p>
              )}
            </div>
          </div>

          {pageUrl && (
            <Link
              href={pageUrl}
              className="rounded-full flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white"
            >
              <Share size={16} /> Share page
            </Link>
          )}
        </div>

        {/* Earnings */}
        <div className="mt-6 border-t flex flex-col gap-2 border-gray-100  pt-6">
          <div className="flex items-center gap-6">
            <h3 className="text-2xl font-semibold">Earnings</h3>
            <div className="relative">
              <DropDownMenu />
            </div>
          </div>

          <p className="mt-3 text-5xl font-bold">$0</p>

          <div className="mt-3 flex gap-6 text-sm text-zinc-500">
            <span>🟡 $0 Supporters</span>
            <span>🔴 $0 Membership</span>
            <span>🔵 $0 Shop</span>
          </div>
        </div>
      </div>

      {/* Empty supporters card */}
      <div className="mx-auto mt-6 max-w-3xl rounded-2xl bg-white p-10 flex flex-col justify-center items-center  dark:bg-zinc-900">
        <span className="p-3 rounded-4xl bg-[#f5f4f5]">
          <Heart size={28} color="#727273" />
        </span>
        <p className="text-lg mt-6 font-medium">
          You don't have any supporters yet
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Share your page with your audience to get started.
        </p>
      </div>

      {/* More ways to earn */}
      <div className="mx-auto mt-10 max-w-3xl">
        <h3 className="mb-6 text-2xl font-semibold">More ways to earn</h3>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
            <LockIcon className=" fill-yellow-500" />{" "}
            <h4 className="font-semibold mt-4">Memership</h4>
            <p className="mt-2 text-sm text-zinc-500">
              Monthly membership for your biggest fans.
            </p>
            <button className="mt-6 flex items-center justify-between rounded-full border border-gray-200 px-4 w-full py-2.5 text-sm">
              Enable
              <span className="p-3 bg-[#f5f4f5] group-hover:translate-x-2 transition-transform duration-400 rounded-4xl">
                <ArrowRight size={18} />
              </span>
            </button>
          </div>

          <div className="group rounded-2xl flex flex-col justify-between bg-white p-6 shadow-sm dark:bg-zinc-900">
            <ShopIcon className="fill-yellow-500" />
            <h4 className="font-semibold mt-4">Shop</h4>
            <p className="mt-2 text-sm text-zinc-500">
              Introducing Shop, the creative way to sell.
            </p>
            <button className="mt-6 flex items-center justify-between rounded-full border border-gray-200 px-4 w-full py-2.5 text-sm">
              Enable
              <span className="p-3 bg-[#f5f4f5] group-hover:translate-x-2 transition-transform duration-400 rounded-4xl">
                <ArrowRight size={18} />
              </span>
            </button>
          </div>

          <div className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
            <PostIcon />

            <h4 className="mt-4 font-semibold">Exclusive posts</h4>

            <p className="mt-2 text-sm text-zinc-500">
              Publish your best content exclusively for your supporters and
              members
            </p>

            <button className="mt-6 flex w-full items-center justify-between rounded-full border border-gray-200 px-4 py-2.5 text-sm">
              Write a post
              <span className="rounded-full bg-[#f5f4f5] p-3 transition-transform duration-400 group-hover:translate-x-2">
                <ArrowRight size={18} />
              </span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export function LockIcon() {
  return (
    <svg
      className="tw-mt-3"
      width="30"
      height="30"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="9" width="16" height="11" rx="2" fill="#FFDD00"></rect>
      <path
        d="M16.1749 9.1741V7.12436C16.1749 4.29425 13.8806 2 11.0505 2C8.22043 2 5.92618 4.29425 5.92618 7.12436V9.1741M11.0505 13.786V15.8358M7.77095 20.4477H14.3301C16.0521 20.4477 16.913 20.4477 17.5707 20.1126C18.1493 19.8178 18.6196 19.3474 18.9144 18.7689C19.2495 18.1112 19.2495 17.2503 19.2495 15.5283V14.0935C19.2495 12.3715 19.2495 11.5106 18.9144 10.8529C18.6196 10.2743 18.1493 9.80399 17.5707 9.50922C16.913 9.1741 16.0521 9.1741 14.3301 9.1741H7.77095C6.049 9.1741 5.18803 9.1741 4.53033 9.50922C3.95181 9.80399 3.48145 10.2743 3.18668 10.8529C2.85156 11.5106 2.85156 12.3715 2.85156 14.0935V15.5283C2.85156 17.2503 2.85156 18.1112 3.18668 18.7689C3.48145 19.3474 3.95181 19.8178 4.53033 20.1126C5.18803 20.4477 6.049 20.4477 7.77095 20.4477Z"
        stroke="#222222"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
export function ShopIcon() {
  return (
    <svg
      className="tw-mt-3"
      width="28"
      height="28"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.783 5.50016C18.255 5.50016 18.4911 5.50016 18.6155 5.4027C18.7238 5.31788 18.7883 5.1889 18.7912 5.05135C18.7945 4.8933 18.6529 4.70448 18.3696 4.32683L16.9396 2.42016C16.7783 2.20505 16.6976 2.0975 16.5954 2.01992C16.5049 1.95122 16.4023 1.89995 16.293 1.86874C16.1696 1.8335 16.0352 1.8335 15.7663 1.8335H6.23296C5.96408 1.8335 5.82963 1.8335 5.70623 1.86874C5.59694 1.89995 5.49441 1.95122 5.40386 2.01992C5.30163 2.0975 5.22096 2.20505 5.05963 2.42016L3.62963 4.32683C3.3464 4.70447 3.20478 4.8933 3.20806 5.05135C3.21092 5.1889 3.27542 5.31788 3.38374 5.4027C3.50821 5.50016 3.74424 5.50016 4.2163 5.50016H17.783Z"
        fill="white"
      ></path>
      <rect x="3" y="5" width="15" height="14" rx="2" fill="#FFDD00"></rect>
      <path
        d="M5.16302 2.54934L3.82401 4.33469C3.55879 4.68831 3.42619 4.86512 3.42926 5.01311C3.43194 5.14191 3.49233 5.26269 3.59376 5.3421C3.71031 5.43336 3.93132 5.43336 4.37335 5.43336H17.0768C17.5188 5.43336 17.7398 5.43336 17.8564 5.3421C17.9578 5.26269 18.0182 5.14191 18.0209 5.01311C18.024 4.86512 17.8914 4.68831 17.6261 4.33469L16.2871 2.54934M5.16302 2.54934C5.31409 2.34791 5.38962 2.2472 5.48535 2.17457C5.57013 2.11023 5.66614 2.06223 5.76848 2.033C5.88403 2 6.00992 2 6.2617 2H15.1885C15.4402 2 15.5661 2 15.6817 2.033C15.784 2.06223 15.88 2.11023 15.9648 2.17457C16.0605 2.2472 16.1361 2.34792 16.2871 2.54934M5.16302 2.54934L3.54934 4.70091C3.34552 4.97268 3.2436 5.10856 3.17124 5.2582C3.10702 5.39098 3.06019 5.53149 3.03189 5.67624C3 5.83937 3 6.00922 3 6.34893L3 16.4201C3 17.3816 3 17.8623 3.18711 18.2295C3.35169 18.5525 3.61431 18.8151 3.93733 18.9797C4.30454 19.1668 4.78526 19.1668 5.74669 19.1668L15.7035 19.1668C16.6649 19.1668 17.1456 19.1668 17.5128 18.9797C17.8358 18.8151 18.0985 18.5525 18.263 18.2295C18.4501 17.8623 18.4501 17.3816 18.4501 16.4201V6.34893C18.4501 6.00923 18.4501 5.83937 18.4183 5.67624C18.39 5.53149 18.3431 5.39098 18.2789 5.2582C18.2065 5.10856 18.1046 4.97268 17.9008 4.70091L16.2871 2.54934M14.1584 8.86673C14.1584 9.77732 13.7967 10.6506 13.1528 11.2945C12.5089 11.9384 11.6357 12.3001 10.7251 12.3001C9.81449 12.3001 8.9412 11.9384 8.29732 11.2945C7.65344 10.6506 7.29171 9.77732 7.29171 8.86673"
        stroke="#222222"
        strokeWidth="1.40456"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
export function PostIcon() {
  return (
    <svg
      className="tw-mt-3"
      width="28"
      height="28"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2.58301"
        y="2.5835"
        width="16.8333"
        height="16.8333"
        rx="3.25"
        fill="#FFDD00"
        stroke="#222222"
        strokeWidth="1.5"
      ></rect>
      <path
        d="M7.33301 9.1665H15.583"
        stroke="#222222"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M7.33301 12.8335H12.833"
        stroke="#222222"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
