import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Returns the total note count, the 3 most recently created notes,
 */
export async function getStats(userId: string) {
  const [count, recent, allNotes] = await Promise.all([
    prisma.note.count({
      where: { userId },
    }),
    prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.note.findMany({
      where: { userId },
      select: {
        sourceText: true,
        generated: true,
      },
    }),
  ]);

  let totalWords = 0;
  let totalBulletPoints = 0;

  for (const note of allNotes) {
    // Calculate reading time saved
    if (note.sourceText) {
      const words = note.sourceText.trim().split(/\s+/).filter(Boolean).length;
      totalWords += words;
    }

    //  Count insights (list items in generated markdown)
    if (note.generated) {
      // Matches markdown list item indicators at the start of a line
      const bulletMatches = note.generated.match(/^\s*[-*+]\s+/gm);
      if (bulletMatches) {
        totalBulletPoints += bulletMatches.length;
      }
    }
  }

  // Reading speed estimate: 200 words per minute.
  // Dynamic summaries save ~80% of total reading/analyzing time.
  // timeSavedMinutes = (words / 200) * 0.8 = words / 250
  let timeSavedMinutes = totalWords / 250;

  // Fallback: If no text was uploaded but notes exist, estimate 10 minutes saved per note
  if (timeSavedMinutes === 0 && allNotes.length > 0) {
    timeSavedMinutes = allNotes.length * 10;
  }

  const timeSavedHours = timeSavedMinutes / 60;
  
  // Fallback: If no bullet points found, estimate 10 insights per note
  const insightsCount = totalBulletPoints || (allNotes.length * 10);

  return {
    count,
    recent,
    timeSaved: timeSavedHours,
    insights: insightsCount,
  };
}
