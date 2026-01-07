"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function AppNav() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/app" className="text-xl font-bold text-gray-900">
            NameVault
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex gap-6">
              <Link href="/app" className="text-sm text-gray-700 hover:text-gray-900">Dashboard</Link>
              <Link href="/app/domains" className="text-sm text-gray-700 hover:text-gray-900">Domains</Link>
              <Link href="/app/alerts" className="text-sm text-gray-700 hover:text-gray-900">Alerts</Link>
            </div>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
}
