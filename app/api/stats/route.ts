import { getStats } from "@/lib/notes/getStats";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { count, recent } = await getStats();

    return NextResponse.json({
      success: true,
      count,
      recent,
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