import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Computes workspace statistics (note counts, time saved, and insights) for a user.
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
        characters: true,
        generated: true,
      },
    }),
  ]);

  let totalWords = 0;
  let totalBulletPoints = 0;

  for (const note of allNotes) {
    if (note.characters > 0) {
      totalWords += Math.round(note.characters / 6);
    } else if (note.generated) {
      totalWords += Math.round((note.generated.length * 4) / 6);
    }

    if (note.generated) {
      const bulletMatches = note.generated.match(/^\s*[-*+]\s+/gm);
      if (bulletMatches) {
        totalBulletPoints += bulletMatches.length;
      }
    }
  }

  // Reading benchmark: 200 wpm with ~80% reading time saved
  let timeSavedMinutes = totalWords / 250;

  if (timeSavedMinutes === 0 && allNotes.length > 0) {
    timeSavedMinutes = allNotes.length * 10;
  }

  const timeSavedHours = timeSavedMinutes / 60;
  const insightsCount = totalBulletPoints || allNotes.length * 10;

  return {
    count,
    recent,
    timeSaved: timeSavedHours,
    insights: insightsCount,
  };
}
