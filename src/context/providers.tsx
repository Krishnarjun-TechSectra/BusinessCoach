"use client";

import type React from "react";

import { SessionProvider } from "next-auth/react";
import { AuthContextProvider } from "./authContext";
import { UserContextProvider } from "./userContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        <UserContextProvider>{children}</UserContextProvider>
      </AuthContextProvider>
    </SessionProvider>
  );
}
