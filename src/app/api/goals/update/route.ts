import { NextResponse } from "next/server";
import { updateGoal } from "@/lib/sheetData";

export async function POST(req: Request) {
  try {
    const { email, month, goalColumn, value } = await req.json();

    if (!email || !month || !goalColumn || typeof value !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await updateGoal({ email, month, goalColumn, value });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Goal update error:", error);
    return NextResponse.json(
      { error: "Failed to update goal", details: (error as Error).message },
      { status: 500 }
    );
  }
}
