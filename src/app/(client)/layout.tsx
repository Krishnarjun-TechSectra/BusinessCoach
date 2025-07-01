"use client";
import { AppShell } from "@/components/shared/appShell";
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
      {/* Navbar */}
      <header className="w-full p-4 flex justify-between items-center bg-[rgb(5,69,167)] text-white shadow-md">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={80}
          className="ml-2 sm:ml-4"
        />
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
        <Button
          onClick={() => signOut({ callbackUrl: "/auth" })}
          
          className="text-white border-white hover:bg-white hover:text-[rgb(5,69,167)]"
        >
          Sign Out
        </Button>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
