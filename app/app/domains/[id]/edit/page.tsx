import { getDbUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateDomain } from "../../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditDomainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dbUser = await getDbUser();
  if (!dbUser) redirect("/sign-in");

  const domain = await prisma.domain.findFirst({
    where: { id, userId: dbUser.id },
  });

  if (!domain) {
    redirect("/app/domains");
  }

  // For date input value: YYYY-MM-DD
  const expiryValue = domain.expiryDate
    ? new Date(domain.expiryDate).toISOString().slice(0, 10)
    : "";

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit domain</h1>
          <p className="text-gray-600 mt-1">
            Update registrar, expiry and auto-renew.
          </p>
        </div>

        <Link
          href="/app/domains"
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          ← Back
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <form action={updateDomain} className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input type="hidden" name="id" value={domain.id} />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Domain
            </label>
            <input
              name="name"
              defaultValue={domain.name}
              className="mt-1 w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registrar
            </label>
            <input
              name="registrar"
              defaultValue={domain.registrar ?? ""}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Cloudflare"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiry date
            </label>
            <input
              name="expiryDate"
              type="date"
              defaultValue={expiryValue}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <input
              id="autoRenew"
              name="autoRenew"
              type="checkbox"
              defaultChecked={domain.autoRenew}
              className="h-4 w-4"
            />
            <label htmlFor="autoRenew" className="text-sm text-gray-700">
              Auto-renew enabled
            </label>
          </div>

          <div className="md:col-span-4 flex justify-end gap-3">
            <Link
              href="/app/domains"
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm text-white"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
