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
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <Button
              onClick={() => signOut({ callbackUrl: "/auth" })}
              variant="outline"
              className="bg-[rgb(5,69,167)] text-white"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Welcome, {user?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You have full administrative access to the platform.
                </p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>System Management</CardTitle>
                <CardDescription>Administrative tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Manage Users
                </Button>
                <Button className="w-full" variant="outline">
                  System Settings
                </Button>
                <Button className="w-full" variant="outline">
                  View Logs
                </Button>
              </CardContent>
            </Card> */}
          </div>
          <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight mt-6">
              All Clients
            </h1>
            <div className="grid grid-cols-1 gap-8 ">
              <div className="lg:col-span-2">
                <ClientList />
              </div>
              {/* <div className="lg:col-span-1">
                <Leaderboard  />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
