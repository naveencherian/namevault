import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function assertCronAuth(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return; // allow locally if not set
  const header = req.headers.get("x-cron-secret");
  if (header !== secret) throw new Error("Unauthorized");
}

function utcDayRange(date: Date) {
  const start = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const end = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
  );
  return { start, end };
}

function addDaysUTC(base: Date, days: number) {
  return new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + days)
  );
}

export async function GET(req: Request) {
  try {
    assertCronAuth(req);

    const today = new Date();

    const targets = [
      { type: "D1" as const, days: 1, settingKey: "alert1Day" as const, label: "1 day" },
      { type: "D7" as const, days: 7, settingKey: "alert7Days" as const, label: "7 days" },
      { type: "D30" as const, days: 30, settingKey: "alert30Days" as const, label: "30 days" },
    ];

    const results: any[] = [];

    for (const t of targets) {
      const targetDate = addDaysUTC(today, t.days);
      const { start, end } = utcDayRange(targetDate);

      const domains = await prisma.domain.findMany({
        where: { expiryDate: { gte: start, lt: end } },
        include: {
          user: { include: { alertSettings: true } },
        },
      });

      for (const d of domains) {
        const settings = d.user.alertSettings;
        const email = d.user.email;

        if (!settings || !email) continue;
        if (!settings[t.settingKey]) continue;

        const alreadySent = await prisma.alertLog.findUnique({
          where: {
            userId_domainId_type: {
              userId: d.userId,
              domainId: d.id,
              type: t.type,
            },
          },
        });

        if (alreadySent) continue;

        const subject = `NameVault: ${d.name} expires in ${t.label}`;
        const body = `Reminder: Your domain ${d.name} expires in ${t.label} (on ${new Date(
          d.expiryDate!
        ).toLocaleDateString()}).\n
Registrar: ${d.registrar ?? "-"}
Auto-renew: ${d.autoRenew ? "Yes" : "No"}

— NameVault`;

        await sendEmail(email, subject, body);

        await prisma.alertLog.create({
          data: { userId: d.userId, domainId: d.id, type: t.type },
        });

        results.push({ domain: d.name, to: email, type: t.type });
      }
    }

    return NextResponse.json({ ok: true, sent: results.length, results });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Cron failed" },
      { status: 500 }
    );
  }
}
