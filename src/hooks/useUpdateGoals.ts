import { useState } from "react";

export function useUpdateGoal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateGoal({
    email,
    month,
    goalColumn,
    value,
  }: {
    email: string;
    month: string;
    goalColumn: string;
    value: string;
  }) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/goals/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, month, goalColumn, value }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update");

      return json;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { updateGoal, loading, error };
}
