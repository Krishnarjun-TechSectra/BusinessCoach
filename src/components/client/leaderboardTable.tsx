"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonStandingIcon, Trophy, Loader2 } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import { useEffect, useState } from "react";

export function Leaderboard() {
  const [monthDisplay, setMonthDisplay] = useState(""); // e.g. "June 2025"
  const [monthKey, setMonthKey] = useState(""); // e.g. "Score_June_2025"

  // Infer current month on load
  useEffect(() => {
    const now = new Date();
    const display = `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
    const key = `Score_${display.replace(" ", "_")}`;
    setMonthDisplay(display);
    setMonthKey(key);
  }, []);

  const { data, isLoading, error } = useLeaderboard(monthKey);
  // const monthsList = getPastMonths(6); // Last 6 months

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          See how you rank against others for <b>{monthDisplay || "..."}</b>
        </CardDescription>
        {/* <div className="mt-4 w-60">
          <Select
            value={monthDisplay}
            onValueChange={(selected) => {
              setMonthDisplay(selected);
              setMonthKey(`Score_${selected.replace(" ", "_")}`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthsList.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="animate-spin mr-2" />
            Loading leaderboard...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-6">
            Error loading leaderboard: {error}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-bold text-lg">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <PersonStandingIcon />
                        <div className="flex flex-col">
                          <span className="font-medium">{entry.name}</span>
                          {entry.name === "You" && (
                            <Badge className="w-fit">You</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// // Utility to get last `count` months in "June 2025" format
// function getPastMonths(count: number): string[] {
//   const months: string[] = [];
//   const now = new Date();

//   for (let i = 0; i < count; i++) {
//     const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//     months.push(`${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`);
//   }

//   return months;
// }
