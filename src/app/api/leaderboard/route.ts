import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchLeaderboardByMonth } from "@/lib/sheetData";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json({ error: "Missing month parameter" }, { status: 400 });
  }

  try {
    const leaderboard = await fetchLeaderboardByMonth(month);
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("[API] GET /leaderboard error:", error);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}
