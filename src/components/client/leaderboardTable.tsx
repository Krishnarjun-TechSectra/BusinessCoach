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
import { PersonStandingIcon, Trophy, Loader2 } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export function Leaderboard() {
  const [monthDisplay, setMonthDisplay] = useState(""); // e.g. "June 2025"
  const [monthKey, setMonthKey] = useState(""); // e.g. "Score_June_2025"
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const now = new Date();
    const display = `${now.toLocaleString("default", {
      month: "long",
    })} ${now.getFullYear()}`;
    const key = `Score_${display.replace(" ", "_")}`;
    setMonthDisplay(display);
    setMonthKey(key);
  }, []);

  const { data, isLoading, error } = useLeaderboard();

  const totalPages = data ? Math.ceil(data.length / ITEMS_PER_PAGE) : 1;
  const paginatedData = data?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    // Reset to first page when data changes (e.g., month switch)
    setCurrentPage(1);
  }, [monthKey]);

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
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData?.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-bold text-lg">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </TableCell>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
