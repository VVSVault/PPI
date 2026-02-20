'use client'

import { useEffect, useState } from 'react'
import { Header, OrderHistoryTable } from '@/components/dashboard'
import type { OrderData } from '@/components/dashboard/order-history-table'
import { Loader2 } from 'lucide-react'

const ITEMS_PER_PAGE = 20

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/orders?limit=${ITEMS_PER_PAGE}&offset=${page * ITEMS_PER_PAGE}`)
        if (!res.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await res.json()
        const fetchedOrders: OrderData[] = data.orders || []
        setOrders(fetchedOrders)
        setHasMore(fetchedOrders.length === ITEMS_PER_PAGE)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(err instanceof Error ? err.message : 'Failed to load order history')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [page])

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (hasMore) setPage(page + 1)
  }

  if (loading) {
    return (
      <div>
        <Header title="Order History" />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <p className="text-gray-500">Loading order history...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Order History" />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setPage(0)}
              className="mt-2 text-sm text-red-600 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Order History" />

      <div className="p-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No orders found. Place your first order to see it here!</p>
          </div>
        ) : (
          <>
            <OrderHistoryTable orders={orders} />

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page + 1}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={page === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    page === 0
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!hasMore}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    !hasMore
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
