import { USAGE } from "./config";

export function calculateCredits(text: string) : number {
    return Math.max(
        1,
        Math.ceil(text.length / USAGE.CHARACTERS_PER_CREDIT)
    )
}