import { getStats } from "@/lib/notes/getStats";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { count, recent, timeSaved, insights } = await getStats(session.user.id);

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