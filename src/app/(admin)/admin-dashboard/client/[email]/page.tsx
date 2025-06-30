"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProgressGoals } from "@/components/client/progressTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Briefcase, PersonStandingIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMonthlyData } from "@/hooks/useMonthlyDashboard"; // your custom hook
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function ClientDetailPage() {
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const { data, isLoading, error } = useMonthlyData(email);

  return (
    <div className="space-y-8 min-h-screen bg-gray-50 p-4">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => signOut({ callbackUrl: "/auth" })} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <Card>
            <CardHeader>
              <CardTitle>Welcome, {data?.progress[0].Name}!</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <Badge variant="secondary">Client</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {isLoading ? (
        <div>Loading data...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <ProgressGoals progress={data.progress}  />
      )}
    </div>
  );
}
