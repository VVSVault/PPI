'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { StepProps } from '../types'
import { PRICING } from '../types'

const posts = [
  {
    value: 'White Vinyl Post' as const,
    name: 'White Vinyl Post',
    description: 'Classic white vinyl post. Professional, clean look that complements any property.',
    price: PRICING.posts['White Vinyl Post'],
    image: '/images/posts/white-post.png',
  },
  {
    value: 'Black Vinyl Post' as const,
    name: 'Black Vinyl Post',
    description: 'Modern black vinyl post. Sleek, contemporary style for upscale listings.',
    price: PRICING.posts['Black Vinyl Post'],
    image: '/images/posts/black-post.png',
  },
  {
    value: 'Signature Pink Post' as const,
    name: 'Signature Pink Vinyl Post',
    description: 'Our signature pink post. Stand out from the crowd and get noticed!',
    price: PRICING.posts['Signature Pink Post'],
    image: '/images/posts/pink-post.png',
    featured: true,
  },
]

export function PostStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Post</h2>
        <p className="text-gray-600">Choose the post color for your installation.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <button
            key={post.value}
            type="button"
            onClick={() => updateFormData({ post_type: post.value })}
            className={cn(
              'relative flex flex-col rounded-xl border-2 overflow-hidden transition-all text-left',
              formData.post_type === post.value
                ? 'border-pink-500 ring-2 ring-pink-200'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            {post.featured && (
              <div className="absolute top-0 left-0 right-0 bg-pink-500 text-white text-xs font-semibold py-1 text-center z-10">
                POPULAR CHOICE
              </div>
            )}

            <div className={cn('relative h-48 bg-gray-50', post.featured && 'mt-6')}>
              <Image
                src={post.image}
                alt={post.name}
                fill
                className="object-cover"
                style={{ objectPosition: 'center 15%' }}
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{post.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.description}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-pink-600">${post.price}</span>
                <span className="text-sm text-gray-500">installation & pickup</span>
              </div>
            </div>

            {formData.post_type === post.value && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 text-center">
        * Reinstallation is FREE if caused by weather or other natural causes
      </p>
    </div>
  )
}
