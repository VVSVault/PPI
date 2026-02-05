'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { Settings, CreditCard, Bell, Users, CheckCircle, XCircle, Send, Loader2 } from 'lucide-react'

interface EmailConfig {
  resendConfigured: boolean
  adminEmail: string | null
  fromEmail: string
}

export default function AdminSettingsPage() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null)
  const [loadingEmail, setLoadingEmail] = useState(true)
  const [sendingTest, setSendingTest] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    async function fetchEmailConfig() {
      try {
        const res = await fetch('/api/admin/settings/email')
        if (res.ok) {
          const data = await res.json()
          setEmailConfig(data)
        }
      } catch (error) {
        console.error('Error fetching email config:', error)
      } finally {
        setLoadingEmail(false)
      }
    }
    fetchEmailConfig()
  }, [])

  const sendTestEmail = async () => {
    setSendingTest(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      })
      const data = await res.json()
      if (res.ok) {
        setTestResult({ success: true, message: data.message })
      } else {
        setTestResult({ success: false, message: data.error })
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to send test email' })
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your business settings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-pink-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Payment Settings</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Configure Stripe integration and payment options.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Stripe Integration</span>
                <Badge variant="success">Configured</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Webhook</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Update STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in deployment settings.
            </p>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Email Notifications</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Configure email notifications for orders and alerts.
            </p>

            {loadingEmail ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : emailConfig ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Resend API</span>
                  {emailConfig.resendConfigured ? (
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="error">
                      <XCircle className="w-3 h-3 mr-1" />
                      Not Configured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Admin Email</span>
                  <span className="text-gray-900 font-medium">
                    {emailConfig.adminEmail || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">From Address</span>
                  <span className="text-gray-900 font-medium text-xs">
                    {emailConfig.fromEmail}
                  </span>
                </div>

                {emailConfig.resendConfigured && emailConfig.adminEmail && (
                  <div className="pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={sendTestEmail}
                      disabled={sendingTest}
                      className="w-full"
                    >
                      {sendingTest ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Test Email
                        </>
                      )}
                    </Button>
                    {testResult && (
                      <div
                        className={`mt-2 p-2 rounded text-xs ${
                          testResult.success
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {testResult.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Failed to load email configuration</p>
            )}
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Business Settings</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Configure pricing, service areas, and business rules.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Fuel Surcharge</span>
                <span className="font-semibold text-gray-900">$2.47</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Expedite Fee</span>
                <span className="font-semibold text-gray-900">$50.00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Rider Install</span>
                <span className="font-semibold text-gray-900">$2.00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Rider Rental</span>
                <span className="font-semibold text-gray-900">$5.00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Sales Tax</span>
                <span className="font-semibold text-gray-900">6%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Service Area</span>
                <span className="font-semibold text-gray-900">Kentucky, Ohio</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Admin Users</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Manage admin access and permissions.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Admin Role</span>
                <Badge variant="info">Database Managed</Badge>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              To add admin users, update the role field in the users table to &apos;admin&apos;
              via Prisma Studio: <code className="bg-gray-100 px-1 rounded">npx prisma studio</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
