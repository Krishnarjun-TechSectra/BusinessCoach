import { useEffect, useState } from "react";

export interface ProgressItem {
  [key: string]: string;
}

export interface GoalItem {
  [key: string]: string;
}



export function useMonthlyData(email: string) {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/monthly?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Failed to load data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [email]);

  return { data, isLoading, error };
}
