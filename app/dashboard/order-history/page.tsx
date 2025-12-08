'use client'

import { Header, OrderHistoryTable } from '@/components/dashboard'
import type { OrderItem } from '@/components/dashboard/order-history-table'

// Mock data - replace with real data from Supabase
const mockOrderItems: OrderItem[] = [
  {
    id: '1',
    date: '2025-11-20',
    itemType: 'post',
    description: 'POST: White Wood',
    address: '1245 Richmond Rd, Lexington, KY 40502',
    amount: 55,
    belongsTo: 'You',
  },
  {
    id: '2',
    date: '2025-11-20',
    itemType: 'rider',
    description: 'RIDER: SOLD',
    address: '1245 Richmond Rd, Lexington, KY 40502',
    amount: 5,
    belongsTo: 'Champs',
  },
  {
    id: '3',
    date: '2025-11-18',
    itemType: 'post',
    description: 'POST: Black Wood',
    address: '890 Tates Creek Rd, Lexington, KY 40517',
    amount: 55,
    belongsTo: 'You',
  },
  {
    id: '4',
    date: '2025-11-18',
    itemType: 'rider',
    description: 'RIDER: Open House',
    address: '890 Tates Creek Rd, Lexington, KY 40517',
    amount: 5,
    belongsTo: 'You',
  },
  {
    id: '5',
    date: '2025-11-15',
    itemType: 'lockbox',
    description: 'LOCKBOX: Supra eKey',
    address: '456 Man O War Blvd, Lexington, KY 40509',
    amount: 25,
    belongsTo: 'You',
  },
  {
    id: '6',
    date: '2025-11-15',
    itemType: 'post',
    description: 'POST: Pink Signature',
    address: '456 Man O War Blvd, Lexington, KY 40509',
    amount: 65,
    belongsTo: 'You',
  },
  {
    id: '7',
    date: '2025-11-10',
    itemType: 'rider',
    description: 'RIDER: Coming Soon',
    address: '789 Nicholasville Rd, Lexington, KY 40503',
    amount: 5,
    belongsTo: 'You',
  },
  {
    id: '8',
    date: '2025-11-05',
    itemType: 'service',
    description: 'SERVICE: Post Repair',
    address: '321 New Circle Rd, Lexington, KY 40505',
    amount: 35,
    belongsTo: 'You',
  },
]

export default function OrderHistoryPage() {
  return (
    <div>
      <Header title="Order History" />

      <div className="p-6">
        <OrderHistoryTable items={mockOrderItems} />

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing 1-{mockOrderItems.length} of {mockOrderItems.length} items
          </p>
          <div className="flex gap-2">
            <button
              disabled
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
