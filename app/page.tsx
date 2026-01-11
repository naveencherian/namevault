import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  // If logged in, send them straight into the app
  if (userId) {
    redirect("/app/domains");
  }

  // If logged out, show landing + "Get started"
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          NameVault
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Never lose track of a domain again
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track domains across registrars, auto-fetch WHOIS data, and get expiry
          alerts — all in one place.
        </p>

        <Link
          href="/sign-in"
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
        >
          Get started
        </Link>

        <p className="text-sm text-gray-500 mt-4">
          No registrar passwords. Your data is always exportable.
        </p>
      </div>
    </main>
  );
}
