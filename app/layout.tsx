import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Apex Affinity Group - MLM Platform',
  description: 'Multi-Level Marketing Platform with 5x9 Forced Matrix',
  keywords: ['MLM', 'Network Marketing', 'Affiliate Marketing', 'Matrix'],
  authors: [{ name: 'Apex Affinity Group' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
