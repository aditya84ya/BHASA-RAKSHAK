import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'BHASA-RAKSHAK - Preserve Your Dialect, Share Your Voice',
  description: 'A platform for preserving and learning dying dialects through community contributions and AI-powered tools.',
  keywords: 'dialect preservation, language learning, cultural heritage, linguistics, community',
  authors: [{ name: 'Team Krishna' }],
  openGraph: {
    title: 'BHASA-RAKSHAK - Preserve Your Dialect, Share Your Voice',
    description: 'A platform for preserving and learning dying dialects through community contributions and AI-powered tools.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'BHASA-RAKSHAK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BHASA-RAKSHAK - Preserve Your Dialect, Share Your Voice',
    description: 'A platform for preserving and learning dying dialects through community contributions and AI-powered tools.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
