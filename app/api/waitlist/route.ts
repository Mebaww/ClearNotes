import { NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/validations/waitlist";
import { joinWaitlist } from "@/lib/waitlist/joinWaitlist";

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

    const waitlistEntry = await joinWaitlist(email, source);

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