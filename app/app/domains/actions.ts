"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getDbUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";


function normalizeDomain(input: string) {
  return input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

export async function createDomain(_prevState: any, formData: FormData) {
  const dbUser = await getDbUser();
  if (!dbUser) return { ok: false, error: "Not signed in." };

  const nameRaw = String(formData.get("name") ?? "");
  const registrarRaw = String(formData.get("registrar") ?? "");
  const expiryRaw = String(formData.get("expiryDate") ?? "");
  const autoRenew = formData.get("autoRenew") === "on";

  const name = normalizeDomain(nameRaw);
  const registrar = registrarRaw.trim() || null;

  if (!name || !name.includes(".") || name.length < 4) {
    return { ok: false, error: "Please enter a valid domain (example: example.com)" };
  }

  const expiryDate = expiryRaw ? new Date(expiryRaw) : null;
  if (expiryDate && Number.isNaN(expiryDate.getTime())) {
    return { ok: false, error: "Invalid expiry date." };
  }

  await prisma.domain.create({
    data: {
      userId: dbUser.id,
      name,
      registrar,
      expiryDate,
      autoRenew,
    },
  });

  revalidatePath("/app/domains");
  redirect("/app/domains");
  
}
