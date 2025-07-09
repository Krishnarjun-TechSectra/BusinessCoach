"use client";

import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressGoals } from "@/components/client/progressTable";
import { Leaderboard } from "@/components/client/leaderboardTable";
import { useMonthlyData } from "@/hooks/useMonthlyDashboard";
import { useOnboardingData } from "@/hooks/useOnboardingData";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const monthly = useMonthlyData(user?.email as string);
  const onboarding = useOnboardingData(user?.email as string);

  if (loading || !user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  console.log("Onboarding data", onboarding);
  console.log("Onboarding data", monthly);
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Welcome Card */}
      <div className="max-w-3xl mx-auto mb-10">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              Welcome, {user?.name}!
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{user?.email}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Table */}
        <div className="lg:col-span-2">
          {monthly.isLoading ? (
            <div>Loading data...</div>
          ) : monthly.error ? (
            <div className="text-white text-center font-bold bg-red-500 rounded-2xl">
              Error: {monthly.error}
            </div>
          ) : (
            <ProgressGoals
              progress={monthly.data?.progress}
              onboarding={onboarding.data?.user}
              email={user?.email as string}
            />
          )}
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-1">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
