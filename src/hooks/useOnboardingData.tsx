import { useEffect, useState } from "react";
import { OnboardingItems } from "@/lib/sheetData";


export function useOnboardingData(email: string) {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    setIsLoading(true);

    async function fetchData() {
      try {
        const res = await fetch(`/api/onboarding?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Failed to load onboarding data");
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [email]);

  return { data, isLoading, error };
}
