import { NextResponse } from "next/server"
import { fetchMonthlyDataByEmail } from "@/lib/sheetData"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const data = await fetchMonthlyDataByEmail(email)
    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    // Return detailed error information for debugging
    return NextResponse.json(
      {
        error: "Failed to load data",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
      
    )
  }
}
