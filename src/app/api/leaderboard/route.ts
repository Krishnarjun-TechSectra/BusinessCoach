import { NextResponse } from "next/server";
import { fetchLeaderboardByMonth } from "@/lib/sheetData";

export async function GET() {
  try {
    const leaderboard = await fetchLeaderboardByMonth();
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("[API] GET /leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
