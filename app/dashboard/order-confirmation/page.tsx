'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/dashboard'
import { Card, CardContent, Button } from '@/components/ui'
import { CheckCircle, MapPin, Calendar, CreditCard, ArrowRight, Loader2 } from 'lucide-react'

interface OrderItem {
  id: string
  description: string
  quantity: number
  totalPrice: number
}

interface Order {
  id: string
  orderNumber: string
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  scheduledDate: string | null
  isExpedited: boolean
  subtotal: number
  fuelSurcharge: number
  expediteFee: number
  total: number
  paymentStatus: string
  createdAt: string
  orderItems: OrderItem[]
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError('No order ID provided')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch order')
        }
        const data = await res.json()
        setOrder(data.order)
      } catch (err) {
        setError('Could not load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div>
        <Header title="Order Confirmation" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div>
        <Header title="Order Confirmation" />
        <div className="p-6">
          <Card variant="bordered">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
              <Link href="/dashboard">
                <Button>Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div>
      <Header title="Order Confirmation" />

      <div className="p-6 max-w-3xl mx-auto">
        {/* Success Banner */}
        <Card className="bg-green-50 border-green-200 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-800">Order Confirmed!</h2>
                <p className="text-green-700">
                  Your order <span className="font-semibold">{order.orderNumber}</span> has been placed successfully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card variant="bordered" className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>

            {/* Property */}
            <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Installation Address</p>
                <p className="font-medium text-gray-900">
                  {order.propertyAddress}
                </p>
                <p className="text-gray-600">
                  {order.propertyCity}, {order.propertyState} {order.propertyZip}
                </p>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Requested Installation</p>
                <p className="font-medium text-gray-900">
                  {order.isExpedited
                    ? 'Same Day (Expedited)'
                    : order.scheduledDate
                    ? formatDate(order.scheduledDate)
                    : 'Next Available'}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-medium text-gray-900 capitalize">
                  {order.paymentStatus === 'succeeded' ? 'Paid' : order.paymentStatus}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card variant="bordered" className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.description}
                    {item.quantity > 1 && ` (x${item.quantity})`}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${Number(item.totalPrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fuel Surcharge</span>
                <span className="text-gray-900">${Number(order.fuelSurcharge).toFixed(2)}</span>
              </div>
              {Number(order.expediteFee) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expedite Fee</span>
                  <span className="text-gray-900">${Number(order.expediteFee).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-pink-600">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card variant="bordered" className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What&apos;s Next?</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">1.</span>
                You&apos;ll receive an email confirmation with your order details.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">2.</span>
                Our team will schedule your installation and notify you of the confirmed date.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">3.</span>
                We&apos;ll complete the installation and send you a confirmation when it&apos;s done.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/order-history" className="flex-1">
            <Button variant="outline" className="w-full">
              View Order History
            </Button>
          </Link>
          <Link href="/dashboard/place-order" className="flex-1">
            <Button className="w-full">
              Place Another Order
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
