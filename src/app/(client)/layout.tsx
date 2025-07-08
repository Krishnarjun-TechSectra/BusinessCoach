"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Responsive Navbar */}
      <header className="w-full px-4 py-2 flex items-center justify-between flex-wrap bg-[rgb(5,69,167)] text-white shadow-md">
        <div className="flex items-center gap-2">
          <Image
            src="/logo_in_white.png"
            alt="Logo"
            width={90}
            height={50}
            className="object-contain sm:w-[140px] sm:h-[90px]"
          />
        </div>
        <h1 className="text-lg sm:text-2xl font-semibold whitespace-nowrap">
          Dashboard
        </h1>
        <Button
          onClick={() => signOut({ callbackUrl: "/auth" })}
          className="text-sm sm:text-base px-2  sm:px-4 py-0.5 sm:py-2  text-white hover:bg-white hover:text-[rgb(5,69,167)]"
        >
          Sign Out
        </Button>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
