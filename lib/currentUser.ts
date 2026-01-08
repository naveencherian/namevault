import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;

  return prisma.user.upsert({
    where: { clerkUserId: userId },
    update: { email },
    create: { clerkUserId: userId, email },
  });
}
