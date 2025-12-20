'use client'

import { Card, CardContent } from '@/components/ui'
import { Settings, CreditCard, Bell, Users } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your business settings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
            <p className="text-sm text-gray-500">
              Stripe integration is configured via environment variables.
              Update STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in your deployment settings.
            </p>
          </CardContent>
        </Card>

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
            <p className="text-sm text-gray-500">
              Email notifications are sent via Resend. Update RESEND_API_KEY and ADMIN_EMAIL
              in your environment variables.
            </p>
          </CardContent>
        </Card>

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
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Fuel Surcharge:</strong> $2.47</p>
              <p><strong>Expedite Fee:</strong> $25.00</p>
              <p><strong>Service Areas:</strong> Lexington, Louisville, Cincinnati</p>
            </div>
          </CardContent>
        </Card>

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
            <p className="text-sm text-gray-500">
              To add admin users, update the role field in the profiles table to 'admin'
              via Supabase dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
