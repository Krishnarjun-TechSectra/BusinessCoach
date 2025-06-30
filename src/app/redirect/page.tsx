"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated") {
      toast({
        title: "Welcome!",
        description: `Signed in as ${session.user.name}`,
      });

      if (session.user.role === "admin") {
        router.replace("/admin-dashboard/dashboard");
      } else if (session.user.role === "client") {
        router.replace("/client-dashboard");
      } else {
        router.replace("/unauthorized");
      }
    }
  }, [status, session, router, toast]);

  return <p className="p-4">Loading...</p>;
}
