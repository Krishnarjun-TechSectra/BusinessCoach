import { useEffect, useState } from "react";

export interface LeaderboardEntry {
  name: string;
  score: number;
}

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    async function fetchData() {
      try {
        const res = await fetch(`/api/leaderboard`);
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
  }, []);

  return { data, isLoading, error };
}
