import { prisma } from './lib/prisma';
async function main() {
  const result = await prisma.note.deleteMany();
  console.log(`Deleted ${result.count} notes.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
