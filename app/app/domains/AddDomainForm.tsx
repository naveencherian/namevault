"use client";

import { useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import { createDomain } from "./actions";

function toDateInputValue(isoOrNull: string | null) {
  if (!isoOrNull) return "";
  const d = new Date(isoOrNull);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function AddDomainForm() {
  const [name, setName] = useState("");
  const [registrar, setRegistrar] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [autoRenew, setAutoRenew] = useState(false);

  const [whoisLoading, setWhoisLoading] = useState(false);
  const [whoisMsg, setWhoisMsg] = useState<string | null>(null);

  const [state, formAction] = useActionState(createDomain as any, {
    ok: false,
    error: null,
  });

  useEffect(() => {
    if (state?.ok) {
      // Clear form after successful save
      setName("");
      setRegistrar("");
      setExpiryDate("");
      setAutoRenew(false);
      setWhoisMsg(null);
    }
  }, [state?.ok]);

  async function fetchWhois() {
    const trimmed = name.trim();
    if (!trimmed) {
      setWhoisMsg("Enter a domain first (example.com).");
      return;
    }

    setWhoisLoading(true);
    setWhoisMsg(null);

    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(trimmed)}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!data?.ok) {
        setWhoisMsg(data?.error ?? "Could not fetch WHOIS info. You can still save manually.");
        return;
      }

      if (data?.registrar) setRegistrar(data.registrar);
      if (data?.expiryDate) setExpiryDate(toDateInputValue(data.expiryDate));

      setWhoisMsg("WHOIS info fetched. Review and click Save.");
    } catch {
      setWhoisMsg("WHOIS lookup failed. You can still save manually.");
    } finally {
      setWhoisLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* Domain */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Domain</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="example.com"
            className="mt-1 w-full rounded-md border px-3 py-2 text-gray-900"
            required
          />
        </div>

        {/* Registrar */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Registrar</label>
          <input
            name="registrar"
            value={registrar}
            onChange={(e) => setRegistrar(e.target.value)}
            placeholder="Cloudflare"
            className="mt-1 w-full rounded-md border px-3 py-2 text-gray-900"
          />
        </div>

        {/* Expiry */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry</label>
          <input
            name="expiryDate"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-gray-900"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={fetchWhois}
            disabled={whoisLoading}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {whoisLoading ? "Fetching…" : "Fetch WHOIS"}
          </button>

          <button
            type="submit"
            className="rounded-md bg-black px-3 py-2 text-sm text-white"
          >
            Save
          </button>
        </div>

        {/* Auto-renew */}
        <div className="md:col-span-5 flex items-center gap-2">
          <input
            id="autoRenew"
            name="autoRenew"
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="autoRenew" className="text-sm text-gray-700">
            Auto-renew enabled
          </label>
        </div>

        {/* Messages */}
        <div className="md:col-span-5">
          {state?.ok ? (
            <p className="text-sm text-green-700">Saved.</p>
          ) : state?.error ? (
            <p className="text-sm text-red-700">{state.error}</p>
          ) : null}

          {whoisMsg ? <p className="text-sm text-gray-700 mt-1">{whoisMsg}</p> : null}
        </div>
      </form>
    </div>
  );
}
