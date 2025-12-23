import { Card, CardContent, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface RiderCardProps {
  name: string
  slug: string
  price: number
  description?: string
  imageUrl?: string
  onSelect?: () => void
}

const riderColors: Record<string, string> = {
  'open-house': 'bg-blue-500',
  'coming-soon': 'bg-purple-500',
  'price-reduced': 'bg-orange-500',
  'under-contract': 'bg-green-500',
  pending: 'bg-yellow-500',
  'new-listing': 'bg-pink-500',
  'for-lease': 'bg-teal-500',
}

const RiderCard = ({ name, slug, price, description, onSelect }: RiderCardProps) => {
  const bgColor = riderColors[slug] || 'bg-gray-500'

  return (
    <Card variant="interactive" className="h-full">
      <CardContent className="p-0">
        {/* Rider Visual */}
        <div className="bg-gray-50 p-6 flex items-center justify-center">
          <div className={cn('px-6 py-3 rounded shadow-md', bgColor)}>
            <span className="text-white font-bold text-sm">{name.toUpperCase()}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-center">{name}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500 text-center">{description}</p>
          )}
          <p className="mt-2 text-lg font-bold text-pink-600 text-center">
            ${price.toFixed(2)}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={onSelect}
          >
            Add to Order
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { RiderCard }
