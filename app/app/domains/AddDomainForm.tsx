"use client";

import { useActionState } from "react";
import { createDomain } from "./actions";

export default function AddDomainForm() {
  const [state, formAction, isPending] = useActionState(createDomain, {
    ok: false,
    error: null as string | null,
  });

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Add a domain</h2>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Domain</label>
          <input
            name="name"
            placeholder="example.com"
            className="mt-1 w-full rounded-md border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Registrar</label>
          <input
            name="registrar"
            placeholder="Cloudflare"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry date</label>
          <input
            name="expiryDate"
            type="date"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <input id="autoRenew" name="autoRenew" type="checkbox" className="h-4 w-4" />
          <label htmlFor="autoRenew" className="text-sm text-gray-700">
            Auto-renew enabled
          </label>
        </div>

        <div className="md:col-span-1 flex items-end justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Add"}
          </button>
        </div>

        {state?.error ? (
          <div className="md:col-span-4 text-sm text-red-600">{state.error}</div>
        ) : null}

        {state?.ok ? (
          <div className="md:col-span-4 text-sm text-green-700">Saved ✅</div>
        ) : null}
      </form>
    </div>
  );
}
