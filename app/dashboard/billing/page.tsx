'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/dashboard'
import { Card, CardContent, Badge } from '@/components/ui'
import { CreditCard, Download, CheckCircle } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  property_address: string
  property_city: string
  property_state: string
  subtotal: number
  fuel_surcharge: number
  expedite_fee: number
  total: number
  created_at: string
  paid_at: string | null
  order_items: Array<{
    description: string
    quantity: number
    total_price: number
  }>
}

export default function BillingPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders?status=completed')
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders.filter((o: Order) => o.payment_status === 'succeeded'))
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div>
        <Header title="Billing History" />
        <div className="p-6 flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Billing History" />

      <div className="p-6">
        <p className="text-gray-600 mb-6">
          View all your past payments and order details.
        </p>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No billing history yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Completed orders will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-0">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {order.order_number}
                        </span>
                        <Badge variant="success" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.property_address}, {order.property_city}, {order.property_state}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm text-gray-500">
                      {order.paid_at
                        ? new Date(order.paid_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-2">
                      {order.order_items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {item.description}
                            {item.quantity > 1 && ` (x${item.quantity})`}
                          </span>
                          <span className="text-gray-900">
                            ${item.total_price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Fees & Total */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Fuel Surcharge</span>
                        <span className="text-gray-900">${order.fuel_surcharge.toFixed(2)}</span>
                      </div>
                      {order.expedite_fee > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Expedite Fee</span>
                          <span className="text-gray-900">${order.expedite_fee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="font-medium text-gray-900">Total Paid</span>
                        <span className="text-lg font-bold text-pink-600">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
