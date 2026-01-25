'use client'

import { useState } from 'react'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { CreditCard, Trash2, Star, Loader2 } from 'lucide-react'

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod
  onDelete: (id: string) => Promise<void>
  onSetDefault: (id: string) => Promise<void>
}

const brandIcons: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  unknown: '💳',
}

const brandColors: Record<string, string> = {
  visa: 'bg-blue-50 border-blue-200',
  mastercard: 'bg-red-50 border-red-200',
  amex: 'bg-green-50 border-green-200',
  discover: 'bg-orange-50 border-orange-200',
  unknown: 'bg-gray-50 border-gray-200',
}

export function PaymentMethodCard({
  paymentMethod,
  onDelete,
  onSetDefault,
}: PaymentMethodCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [settingDefault, setSettingDefault] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return
    }

    setDeleting(true)
    try {
      await onDelete(paymentMethod.id)
    } finally {
      setDeleting(false)
    }
  }

  const handleSetDefault = async () => {
    setSettingDefault(true)
    try {
      await onSetDefault(paymentMethod.id)
    } finally {
      setSettingDefault(false)
    }
  }

  const brandName = paymentMethod.brand.charAt(0).toUpperCase() + paymentMethod.brand.slice(1)

  return (
    <Card className={`${brandColors[paymentMethod.brand] || brandColors.unknown}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {brandName} •••• {paymentMethod.last4}
                </span>
                {paymentMethod.isDefault && (
                  <Badge variant="success" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Expires {paymentMethod.expMonth.toString().padStart(2, '0')}/{paymentMethod.expYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!paymentMethod.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSetDefault}
                disabled={settingDefault}
                className="text-gray-600 hover:text-pink-600"
              >
                {settingDefault ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-gray-600 hover:text-red-600"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
