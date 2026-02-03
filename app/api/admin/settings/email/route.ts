import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { Resend } from 'resend'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const resendConfigured = !!process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || null

    return NextResponse.json({
      resendConfigured,
      adminEmail,
      fromEmail: 'orders@pinkpostinstallations.com',
    })
  } catch (error) {
    console.error('Error fetching email settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action } = await request.json()

    if (action === 'test') {
      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 400 })
      }

      if (!process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: 'ADMIN_EMAIL not configured' }, { status: 400 })
      }

      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'Pink Posts Installations <orders@pinkpostinstallations.com>',
        to: process.env.ADMIN_EMAIL,
        subject: 'Test Email - Pink Posts Installations',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Test Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #FFF0F3; border-radius: 12px; padding: 32px;">
              <h1 style="color: #E84A7A; margin: 0 0 16px;">Test Email</h1>
              <p style="color: #333;">This is a test email from Pink Posts Installations admin dashboard.</p>
              <p style="color: #333;">If you're receiving this, your email configuration is working correctly!</p>
              <p style="color: #666; font-size: 14px; margin-top: 24px;">
                Sent at: ${new Date().toLocaleString()}
              </p>
            </div>
          </body>
          </html>
        `,
      })

      return NextResponse.json({ success: true, message: 'Test email sent successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error with email action:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to send test email'
    }, { status: 500 })
  }
}
