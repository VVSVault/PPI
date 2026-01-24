import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes require admin role
    if (path.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // These paths require authentication
        if (
          path.startsWith('/dashboard') ||
          path.startsWith('/admin') ||
          path.startsWith('/api/orders') ||
          path.startsWith('/api/profile') ||
          path.startsWith('/api/inventory') ||
          path.startsWith('/api/notifications') ||
          path.startsWith('/api/payments') ||
          path.startsWith('/api/service-requests')
        ) {
          return !!token
        }

        // Admin API routes require admin role
        if (path.startsWith('/api/admin')) {
          return token?.role === 'admin'
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // Protected pages
    '/dashboard/:path*',
    '/admin/:path*',
    // Protected API routes
    '/api/orders/:path*',
    '/api/profile/:path*',
    '/api/inventory/:path*',
    '/api/notifications/:path*',
    '/api/payments/:path*',
    '/api/service-requests/:path*',
    '/api/admin/:path*',
  ],
}
