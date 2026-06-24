import { getStats } from "@/lib/notes/getStats";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { count, recent, timeSaved, insights } = await getStats();

    return NextResponse.json({
      success: true,
      count,
      recent,
      timeSaved,
      insights,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
}