"use client";

import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardHeader({ setOpen }) {
  return (
    <div className="md:hidden fixed top-4 left-4 right-4 z-40">
      <div className="flex items-center justify-between rounded-full bg-white p-3 shadow dark:bg-zinc-900">
        <Image src="/chai-logo.png" width={32} height={32} alt="" />

        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5" />
          <button onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
