import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [count, recent] = await Promise.all([
      prisma.note.count(),
      prisma.note.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

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