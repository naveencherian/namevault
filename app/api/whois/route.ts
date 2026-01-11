import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeDomain(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

async function getRdapBaseUrl(domain: string) {
  const url = `https://rdap-bootstrap.arin.net/bootstrap/domain/${encodeURIComponent(
    domain
  )}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("RDAP bootstrap lookup failed");
  const data = await res.json();

  const tld = domain.split(".").pop() || "";
  const services = data?.services || [];
  for (const svc of services) {
    const tlds: string[] = svc?.[0] || [];
    const urls: string[] = svc?.[1] || [];
    if (tlds.includes(tld) && urls.length > 0) return urls[0];
  }
  throw new Error("No RDAP service found for TLD");
}

function extractExpiryAndRegistrar(rdap: any) {
  const events = Array.isArray(rdap?.events) ? rdap.events : [];
  const expiryEvent = events.find((e: any) => e?.eventAction === "expiration");
  const expiryDate = expiryEvent?.eventDate ?? null;

  let registrar = rdap?.registrarName ?? rdap?.registrar ?? null;

  const entities = Array.isArray(rdap?.entities) ? rdap.entities : [];
  if (!registrar) {
    const regEntity = entities.find(
      (en: any) => Array.isArray(en?.roles) && en.roles.includes("registrar")
    );
    const vcard = regEntity?.vcardArray?.[1];
    if (Array.isArray(vcard)) {
      const fn = vcard.find((row: any) => Array.isArray(row) && row[0] === "fn");
      if (fn?.[3]) registrar = fn[3];
    }
  }

  return { expiryDate, registrar };
}

// ✅ Named export for HTTP method:
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domainRaw = String(searchParams.get("domain") ?? "");
    const domain = normalizeDomain(domainRaw);

    if (!domain || !domain.includes(".")) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid domain (example.com)" },
        { status: 400 }
      );
    }

    const baseUrl = await getRdapBaseUrl(domain);
    const rdapUrl = `${baseUrl.replace(/\/$/, "")}/domain/${encodeURIComponent(
      domain
    )}`;

    const rdapRes = await fetch(rdapUrl, { cache: "no-store" });
    if (!rdapRes.ok) {
      return NextResponse.json(
        { ok: false, error: "WHOIS/RDAP lookup failed for this domain." },
        { status: 200 }
      );
    }

    const rdap = await rdapRes.json();
    const { expiryDate, registrar } = extractExpiryAndRegistrar(rdap);

    return NextResponse.json({
      ok: true,
      domain,
      registrar: registrar ?? null,
      expiryDate: expiryDate ?? null,
      source: "rdap",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "WHOIS lookup failed" },
      { status: 200 }
    );
  }
}
