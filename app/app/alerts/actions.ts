"use server";

import { prisma } from "@/lib/prisma";
import { getDbUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export async function updateAlertSettings(formData: FormData) {
  const dbUser = await getDbUser();
  if (!dbUser) redirect("/sign-in");

  await prisma.alertSettings.update({
    where: { userId: dbUser.id },
    data: {
      alert30Days: formData.get("alert30Days") === "on",
      alert7Days: formData.get("alert7Days") === "on",
      alert1Day: formData.get("alert1Day") === "on",
      weeklySummary: formData.get("weeklySummary") === "on",
    },
  });

  redirect("/app/alerts");
}
