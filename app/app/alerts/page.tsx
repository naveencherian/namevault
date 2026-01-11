import { getDbUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateAlertSettings } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AlertsPage() {
  const dbUser = await getDbUser();
  if (!dbUser) redirect("/sign-in");

  const settings = await prisma.alertSettings.findUnique({
    where: { userId: dbUser.id },
  });

  if (!settings) redirect("/app/domains");

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="text-gray-600 mt-1">
          Control when you receive expiry reminders.
        </p>
      </div>

      <form
        action={updateAlertSettings}
        className="rounded-lg border bg-white p-6 space-y-4"
      >
        <input type="hidden" name="userId" value={dbUser.id} />

        <Toggle
          name="alert30Days"
          label="30 days before expiry"
          defaultChecked={settings.alert30Days}
        />

        <Toggle
          name="alert7Days"
          label="7 days before expiry"
          defaultChecked={settings.alert7Days}
        />

        <Toggle
          name="alert1Day"
          label="1 day before expiry"
          defaultChecked={settings.alert1Day}
        />

        <Toggle
          name="weeklySummary"
          label="Weekly summary email"
          defaultChecked={settings.weeklySummary}
        />

        <div className="pt-4">
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm text-white"
          >
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4"
      />
    </label>
  );
}
