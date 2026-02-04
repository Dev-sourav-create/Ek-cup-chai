import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-between border-t border-black/5 px-6 py-8 font-poppins dark:border-white/10 sm:px-10">
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        By continuing, you agree to our{" "}
        <span className="underline text-black/90">terms of service</span> and
        <span>privacy policy</span>
      </div>
      <Link
        href="/sign-up"
        className="rounded-full bg-chaiBrown px-8 py-3 font-medium text-white transition hover:scale-[1.02] hover:opacity-90"
      >
        Sign up
      </Link>
    </footer>
  );
};

export default Footer;
