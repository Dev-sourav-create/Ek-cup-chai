"use client";

import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/themeToggle";

export default function Navbar() {
  return (
    <>
      {/* MOBILE NAVBAR */}
      <div className="md:hidden mx-3 z-40">
        <div className="flex items-center justify-between rounded-full bg-white p-3 shadow dark:bg-zinc-900">
          <Image src="/chai-logo.png" width={32} height={32} alt="" />

          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5" />
            <button onClick={() => window.toggleSidebar?.()}>
              <Menu className="h-5 w-5" />
            </button>
            <UserButton />
          </div>
        </div>
      </div>

      {/* DESKTOP NAVBAR (minimal) */}
      {/* DESKTOP NAVBAR */}
      <div className="hidden md md:flex w-full items-center justify-between   bg-white dark:border-white/10 dark:bg-zinc-900">
        {/* LEFT SPACE SAME AS SIDEBAR */}
        <div className="w-64 shrink-0 border-r border-b  cursor-pointer border-black/5 flex items-center px-6 py-4 bg-zinc-50">
          <Image src="/chai-logo.png" width={36} height={40} alt="logo" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-1 items-center justify-end px-6 py-5 bg-zinc-100">
          <UserButton />
        </div>
      </div>
    </>
  );
}
