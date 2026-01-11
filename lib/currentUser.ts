import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;

  const dbUser = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: { email },
    create: { clerkUserId: userId, email },
  });

  // ✅ Ensure default alert settings exist for every user
  await prisma.alertSettings.upsert({
    where: { userId: dbUser.id },
    update: {},
    create: { userId: dbUser.id },
  });

  return dbUser;
}
