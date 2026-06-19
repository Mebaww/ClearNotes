import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/validations/waitlist";
import { resolveUTMSource } from "@/lib/utm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { email, source } = parsed.data;
    const normalizedSource = resolveUTMSource(source);

    const waitlistEntry = await prisma.waitlist.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {},
      create: {
        email: email.toLowerCase().trim(),
        source: normalizedSource,
      },
    });

    return NextResponse.json(
      { message: "Joined waitlist", id: waitlistEntry.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}