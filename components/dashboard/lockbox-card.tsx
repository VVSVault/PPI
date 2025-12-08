import { Card, CardContent, Button } from '@/components/ui'
import { Lock } from 'lucide-react'

interface LockboxCardProps {
  name: string
  slug: string
  rentalFee: number
  deposit: number
  description?: string
  imageUrl?: string
  onSelect?: () => void
}

const LockboxCard = ({
  name,
  rentalFee,
  deposit,
  description,
  onSelect,
}: LockboxCardProps) => {
  return (
    <Card variant="interactive" className="h-full">
      <CardContent className="p-0">
        {/* Lockbox Visual */}
        <div className="bg-gray-100 p-8 flex items-center justify-center">
          <div className="w-20 h-24 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-gray-300" />
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          {description && (
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          )}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly Rental</span>
              <span className="font-semibold text-gray-900">
                ${rentalFee.toFixed(2)}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Deposit</span>
              <span className="font-semibold text-gray-900">
                ${deposit.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={onSelect}
          >
            Add to Order
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { LockboxCard }
