import type { Metadata } from 'next'
import { SessionProvider } from '@/components/providers/session-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pink Post Installations | Professional Yard Sign Service',
  description: "Central Kentucky's trusted yard sign installation service for real estate professionals. Same-day installation, professional presentation, GPS-tracked service.",
  keywords: ['yard sign installation', 'real estate signs', 'Lexington KY', 'sign service', 'realtor signs'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
