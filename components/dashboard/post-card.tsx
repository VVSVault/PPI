import Image from 'next/image'
import { Card, CardContent, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface PostCardProps {
  name: string
  slug: string
  description: string
  installationFee: number
  imageUrl?: string
  featured?: boolean
  onSelect?: () => void
}

const PostCard = ({
  name,
  description,
  installationFee,
  imageUrl,
  featured,
  onSelect,
}: PostCardProps) => {
  return (
    <Card
      variant="bordered"
      className={cn(
        'overflow-hidden h-full flex flex-col',
        featured && 'ring-2 ring-pink-500'
      )}
    >
      {featured && (
        <div className="bg-pink-500 text-white text-xs font-semibold px-4 py-1 text-center">
          POPULAR CHOICE
        </div>
      )}

      {/* Post Visual */}
      <div className="relative h-48 bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            style={{ objectPosition: 'center 15%' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="mt-2 text-sm text-gray-600 flex-1">{description}</p>

        {/* Pricing */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Installation & Pickup</span>
            <span className="font-semibold text-gray-900">${installationFee}</span>
          </div>
        </div>

        <Button
          variant={featured ? 'primary' : 'outline'}
          className="w-full mt-6"
          onClick={onSelect}
        >
          Select This Post
        </Button>
      </CardContent>
    </Card>
  )
}

export { PostCard }
