"use client";

import { RoleGuard } from "@/components/shared/roleGuard";
import { useAuth } from "@/context/authContext";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientList } from "@/components/admin/clientListTable";
import { clientsData, leaderboardData } from "@/lib/data";
import { Leaderboard } from "@/components/client/leaderboardTable";
import { useToast } from "@/hooks/useToast";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // if (user) {
  //   toast({
  //     title: "Welcome!",
  //     description: `Signed in as ${user.name}`,
  //   });
  // }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div>
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-3xl font-bold">Leader Board</h1>
            <Button
              onClick={() => signOut({ callbackUrl: "/auth" })}
              variant="outline"
              className="bg-[rgb(5,69,167)] text-white"
            >
              Sign Out
            </Button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 ">
              <div className="lg:col-span-1">
                <Leaderboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
