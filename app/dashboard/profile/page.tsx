'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/dashboard'
import { Card, CardContent, Button, Input } from '@/components/ui'
import { User, Mail, Phone, Building, Loader2 } from 'lucide-react'

interface Profile {
  id: string
  email: string
  fullName: string | null
  phone: string | null
  company: string | null
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile)
          setFormData({
            fullName: data.profile.fullName || '',
            email: data.profile.email || '',
            phone: data.profile.phone || '',
            company: data.profile.company || '',
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          company: formData.company,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div>
        <Header title="Profile" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      </div>
    )
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
                disabled
                helperText="Email cannot be changed"
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
                placeholder="(555) 555-5555"
              />

              <Input
                label="Company / Brokerage"
                icon={<Building className="w-5 h-5" />}
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                disabled={!isEditing}
                placeholder="Your brokerage name"
              />
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>
            )}
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
                  label: 'Email notifications for new orders',
                  checked: true,
                },
                {
                  label: 'SMS notifications for installation updates',
                  checked: true,
                },
                {
                  label: 'Email notifications for order confirmations',
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
