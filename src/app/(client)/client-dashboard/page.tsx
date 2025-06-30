"use client";

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
import { Badge } from "@/components/ui/badge";
import { ProgressGoals } from "@/components/client/progressTable";
import { Leaderboard } from "@/components/client/leaderboardTable";
import { goalsData, leaderboardData } from "@/lib/data";
import { useToast } from "@/hooks/useToast";
import { useMonthlyData } from "@/hooks/useMonthlyDashboard";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { data, isLoading, error } = useMonthlyData(user?.email as string);

  // if (user) {
  //   toast({
  //     title: "Welcome!",
  //     description: `Signed in as ${user.name}`,
  //   });
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please sign in
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button
            onClick={() => signOut({ callbackUrl: "/auth" })}
            variant="outline"
          >
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.name}!</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight mt-6">
          Your Dashboard
        </h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {isLoading ? (
            <div>Loading data...</div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : (
            <div className="lg:col-span-2">
              <ProgressGoals progress={data?.progress} />
            </div>
          )}

          <div className="lg:col-span-1">
            <Leaderboard users={leaderboardData} />
          </div>
        </div>
      </div>
    </div>
  );
}
