import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NameVault - Never lose track of a domain again',
  description: 'A dashboard to track domains, expiry dates, and renewal alerts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
