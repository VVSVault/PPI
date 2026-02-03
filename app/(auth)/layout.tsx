import Link from 'next/link'
import { Logo } from '@/components/shared'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Logo size="md" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Pink Posts Installations.{' '}
          <Link href="/terms" className="hover:text-pink-500">
            Terms
          </Link>{' '}
          &{' '}
          <Link href="/privacy" className="hover:text-pink-500">
            Privacy
          </Link>
        </p>
      </footer>
    </div>
  )
}
