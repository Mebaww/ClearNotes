import { waitlistSchema } from "@/lib/validations/waitlist";
import { joinWaitlist } from "@/lib/waitlist/joinWaitlist";
import { ok, apiErr, handleError } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return apiErr("INVALID_REQUEST", "Invalid waitlist submission data.");
    }

    const { email, source } = parsed.data;
    const waitlistEntry = await joinWaitlist(email, source);

    return ok({ message: "Joined waitlist", id: waitlistEntry.id });
  } catch (error) {
    return handleError(error);
  }
}