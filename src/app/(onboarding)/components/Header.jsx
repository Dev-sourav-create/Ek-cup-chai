import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <nav className="flex w-full items-center justify-between px-6 py-8 font-poppins text-sm text-zinc-900 dark:text-zinc-100 sm:px-10">
      <logo-section>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Ek Cup Chai"
            width={48}
            height={48}
            className="object-contain"
          />
        </Link>
      </logo-section>
      <div className="font-light">
        Already have an account?{" "}
        <Link className="underline hover:no-underline" href="/sign-in">
          Sign in
        </Link>
      </div>
    </nav>
  );
};

export default Header;
