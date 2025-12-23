'use client'

import { MapPin, Calendar, Clock, DollarSign } from 'lucide-react'
import { Header, StatsCards, ActivePostsTable } from '@/components/dashboard'
import type { Installation } from '@/components/dashboard/active-posts-table'

// Mock data - replace with real data from Supabase
const mockStats = [
  {
    label: 'Active Posts',
    value: 12,
    icon: MapPin,
    trend: { value: 8, isPositive: true },
  },
  {
    label: 'Pending Orders',
    value: 3,
    icon: Clock,
  },
  {
    label: 'Scheduled Removals',
    value: 2,
    icon: Calendar,
  },
  {
    label: 'This Month',
    value: '$847',
    icon: DollarSign,
    trend: { value: 12, isPositive: true },
  },
]

const mockInstallations: Installation[] = [
  {
    id: '1',
    installDate: '2025-11-20',
    address: '1245 Richmond Rd',
    city: 'Lexington',
    state: 'KY',
    zip: '40502',
    agentRef: 'RR-001',
    mlsNumber: '12345',
    status: 'active',
    postType: 'white',
  },
  {
    id: '2',
    installDate: '2025-11-18',
    address: '890 Tates Creek Rd',
    city: 'Lexington',
    state: 'KY',
    zip: '40517',
    agentRef: 'RR-002',
    mlsNumber: '12346',
    status: 'active',
    postType: 'black',
  },
  {
    id: '3',
    installDate: '2025-11-15',
    address: '456 Man O War Blvd',
    city: 'Lexington',
    state: 'KY',
    zip: '40509',
    agentRef: 'RR-003',
    mlsNumber: '12347',
    status: 'removal_scheduled',
    postType: 'pink',
  },
  {
    id: '4',
    installDate: '2025-11-25',
    address: '789 Nicholasville Rd',
    city: 'Lexington',
    state: 'KY',
    zip: '40503',
    agentRef: 'RR-004',
    mlsNumber: '12348',
    status: 'scheduled',
    postType: 'white',
  },
]

export default function DashboardPage() {
  return (
    <div>
      <Header
        title="Dashboard"
        action={{
          label: '+ Place New Order',
          href: '/dashboard/place-order',
        }}
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={mockStats} />

        {/* Active Installations */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Installations
            </h2>
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <ActivePostsTable installations={mockInstallations} />
        </div>
      </div>
    </div>
  )
}
