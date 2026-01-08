import { getDbUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import AddDomainForm from "./AddDomainForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DomainsPage() {
  const dbUser = await getDbUser();

  if (!dbUser) {
    return <div className="p-6 text-gray-900">Please sign in</div>;
  }

  const domains = await prisma.domain.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="text-3xl font-bold">Domains</h1>
        <p className="text-gray-600 mt-1">Your domains tracked in NameVault.</p>
      </div>

      <AddDomainForm />

      {domains.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-gray-700">
          No domains yet. We’ll add your first one next.
        </div>
      ) : (
        <div className="rounded-lg border bg-white overflow-hidden text-gray-900">
          <table className="w-full text-sm text-gray-900">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left p-3">Domain</th>
                <th className="text-left p-3">Registrar</th>
                <th className="text-left p-3">Expiry</th>
                <th className="text-left p-3">Auto-renew</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3 font-medium text-gray-900">{d.name}</td>
                  <td className="p-3 text-gray-800">{d.registrar ?? "-"}</td>
                  <td className="p-3 text-gray-800">
                    {d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3 text-gray-800">{d.autoRenew ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
