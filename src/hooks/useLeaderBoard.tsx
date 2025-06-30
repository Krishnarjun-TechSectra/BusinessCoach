import { useEffect, useState } from "react";

export interface LeaderboardEntry {
  name: string;
  score: number;
}

export function useLeaderboard(month: string) {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!month) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/leaderboard?month=${encodeURIComponent(month)}`);
        if (!res.ok) throw new Error("Failed to load leaderboard");
        const json = await res.json();
        setData(json.leaderboard || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [month]);

  return { data, isLoading, error };
}
