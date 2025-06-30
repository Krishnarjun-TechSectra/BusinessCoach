"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      // Redirect based on role
      if (session.user.role === "admin") {
        router.push("/admin-dashboard/dashboard");
      } else if (session.user.role === "client") {
        router.push("/client-dashboard");
      } else {
        router.push("/auth");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (

      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Rocket className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Akhil Business Coach
            </CardTitle>
            <CardDescription>
              Your hub for tracking progress and achieving business goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 ">
              <Button asChild size="lg" >
                <Link href="/auth">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

  );
}
