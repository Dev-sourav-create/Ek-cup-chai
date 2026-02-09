"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/themeToggle";

import {
  Search,
  ChevronDown,
  HelpCircle,
  Menu,
  X,
  Heart,
  Apple,
  Smartphone,
} from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className=" w-full flex items-center justify-between py-2 font-poppins md:py-4 px-4 sm:px-6 bg-white dark:bg-black z-50">
        {/* ================= MOBILE ================= */}
        <div className="flex items-center justify-between w-full md:hidden">
          {/* Left */}
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

            <Image
              src="/logo.png"
              alt="Ek Cup Chai"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          {/* Right (Auth) */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <SignedOut>
              <Link href="/sign-in" className="text-xs font-bold">
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="bg-chaiBrown text-white text-xs font-bold px-3 py-1 rounded-full"
              >
                Sign up
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* ================= DESKTOP LEFT ================= */}
        <div className="hidden md:flex items-center gap-8 text-base font-semibold">
          <Link href="/faq" className="hover:text-chaiBrown">
            FAQ
          </Link>

          <Link
            href="/wall"
            className="flex items-center gap-1 hover:text-chaiBrown"
          >
            Wall of <Heart className="text-chaiBrown w-4 h-4" />
          </Link>

          {/* Resources Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 hover:text-chaiBrown"
            >
              Resources <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-10 left-0 w-52 bg-white dark:bg-zinc-900 shadow-xl rounded-xl p-4 space-y-4 border">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm hover:text-chaiBrown"
                >
                  <HelpCircle className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm hover:text-chaiBrown"
                >
                  <Apple className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm hover:text-chaiBrown"
                >
                  <Smartphone className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ================= DESKTOP CENTER ================= */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Ek Cup Chai"
              width={48}
              height={48}
              className="object-contain"
            />
            <h1 className="font-pacifico text-lg text-zinc-700 pt-1">
              Ek Cup Chai
            </h1>
          </div>
        </div>

        {/* ================= DESKTOP RIGHT ================= */}
        <div className="hidden md:flex items-center gap-4">
          {/* <ThemeToggle /> */}

          <div className="relative">
            <input
              type="text"
              placeholder="Search creators"
              className="bg-gray-100 dark:bg-zinc-800 text-sm px-4 py-2 pl-10 rounded-full"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>

          <SignedOut>
            <Link href="/sign-in" className="hover:text-chaiBrown">
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="bg-[#fddd03] text-black/90 dark:text-black dark:bg-white px-5 py-2 rounded-full"
            >
              Sign up
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-black z-40 flex flex-col gap-6 p-6 pt-20 text-lg font-semibold">
          <Link href="/faq">FAQ</Link>
          <Link href="/wall" className="flex items-center gap-2">
            Wall of <FaRegHeart className="text-chaiBrown" />
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
