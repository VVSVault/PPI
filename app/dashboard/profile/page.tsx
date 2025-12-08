'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard'
import { Card, CardContent, Button, Input } from '@/components/ui'
import { User, Mail, Phone, Building, MapPin, CreditCard } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: 'Jane Smith',
    email: 'jane.smith@abcrealty.com',
    phone: '(859) 555-0123',
    companyName: 'ABC Realty',
    licenseNumber: 'KY-12345',
    billingAddress: '123 Main Street, Lexington, KY 40507',
  })

  const handleSave = () => {
    // Save profile data to Supabase
    setIsEditing(false)
  }

  return (
    <div>
      <Header title="Profile" />

      <div className="p-6 max-w-3xl">
        {/* Profile Information */}
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h2>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                icon={<User className="w-5 h-5" />}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={!isEditing}
              />

              <Input
                label="Email Address"
                type="email"
                icon={<Mail className="w-5 h-5" />}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
              />

              <Input
                label="Phone Number"
                type="tel"
                icon={<Phone className="w-5 h-5" />}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
              />

              <Input
                label="Company / Brokerage"
                icon={<Building className="w-5 h-5" />}
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                disabled={!isEditing}
              />

              <Input
                label="License Number"
                icon={<CreditCard className="w-5 h-5" />}
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                disabled={!isEditing}
              />

              <Input
                label="Billing Address"
                icon={<MapPin className="w-5 h-5" />}
                value={formData.billingAddress}
                onChange={(e) =>
                  setFormData({ ...formData, billingAddress: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card variant="bordered" className="mt-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Change Password
            </h2>
            <div className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
              />
              <Button>Update Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card variant="bordered" className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Methods
              </h2>
              <Button variant="outline" size="sm">
                Add Card
              </Button>
            </div>

            <div className="space-y-4">
              {/* Saved Card */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AMEX</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      American Express ****1005
                    </p>
                    <p className="text-sm text-gray-500">Expires 12/26</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    Default
                  </span>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card variant="bordered" className="mt-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {[
                {
                  label: 'Email notifications for new invoices',
                  checked: true,
                },
                {
                  label: 'SMS notifications for installation updates',
                  checked: true,
                },
                {
                  label: 'Email notifications for payment reminders',
                  checked: true,
                },
                {
                  label: 'Marketing emails and promotions',
                  checked: false,
                },
              ].map((pref, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked={pref.checked}
                    className="rounded border-gray-300 text-pink-500 focus:ring-pink-500 w-5 h-5"
                  />
                  <span className="text-gray-700">{pref.label}</span>
                </label>
              ))}

              <Button variant="outline" className="mt-4">
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
