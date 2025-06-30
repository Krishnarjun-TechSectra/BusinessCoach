// app/api/data/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchAllUsersFromSheet } from "@/lib/sheetData";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const users = await fetchAllUsersFromSheet();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}
