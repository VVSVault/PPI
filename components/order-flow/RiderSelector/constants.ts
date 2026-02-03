import type { RiderCategoryConfig, RiderOption } from './types'

export const RIDER_CATEGORIES: RiderCategoryConfig[] = [
  {
    id: 'popular',
    label: 'Popular',
    icon: 'Star',
    defaultExpanded: true
  },
  {
    id: 'status',
    label: 'Status',
    icon: 'Tag',
    defaultExpanded: false
  },
  {
    id: 'bedrooms',
    label: 'Bedrooms',
    icon: 'Bed',
    defaultExpanded: false
  },
  {
    id: 'property_features',
    label: 'Property Features',
    icon: 'Home',
    defaultExpanded: false
  },
  {
    id: 'rental_lease',
    label: 'Rental & Lease',
    icon: 'Key',
    defaultExpanded: false
  },
  {
    id: 'special',
    label: 'Special',
    icon: 'Sparkles',
    defaultExpanded: false
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: 'Edit',
    defaultExpanded: false
  }
]

export const RIDERS: RiderOption[] = [
  // === POPULAR (duplicates from other categories for quick access) ===
  { id: 'pop-pending', name: 'Pending', slug: 'pending', category: 'popular', icon: 'Clock' },
  { id: 'pop-coming-soon', name: 'Coming Soon', slug: 'coming-soon', category: 'popular', icon: 'Calendar' },
  { id: 'pop-for-sale', name: 'For Sale', slug: 'for-sale', category: 'popular', icon: 'DollarSign' },
  { id: 'pop-sold', name: 'SOLD', slug: 'sold', category: 'popular', icon: 'CheckCircle' },

  // === STATUS ===
  { id: 'pending', name: 'Pending', slug: 'pending', category: 'status', icon: 'Clock' },
  { id: 'coming-soon', name: 'Coming Soon', slug: 'coming-soon', category: 'status', icon: 'Calendar' },
  { id: 'for-sale', name: 'For Sale', slug: 'for-sale', category: 'status', icon: 'DollarSign' },
  { id: 'sold', name: 'SOLD', slug: 'sold', category: 'status', icon: 'CheckCircle' },
  { id: 'under-contract', name: 'Under Contract', slug: 'under-contract', category: 'status', icon: 'FileCheck' },
  { id: 'under-contract-backups', name: 'Under Contract, Taking Backups', slug: 'under-contract-backups', category: 'status', icon: 'FileCheck' },
  { id: 'price-reduced', name: 'Price Reduced', slug: 'price-reduced', category: 'status', icon: 'TrendingDown' },
  { id: 'new-listing', name: 'New Listing', slug: 'new-listing', category: 'status', icon: 'Sparkles' },
  { id: 'by-appointment', name: 'By Appointment Only', slug: 'by-appointment', category: 'status', icon: 'CalendarCheck' },

  // === BEDROOMS ===
  { id: '3-beds', name: '3 Beds', slug: '3-beds', category: 'bedrooms', icon: 'Bed' },
  { id: '4-beds', name: '4 Beds', slug: '4-beds', category: 'bedrooms', icon: 'Bed' },
  { id: '5-beds', name: '5 Beds', slug: '5-beds', category: 'bedrooms', icon: 'Bed' },
  { id: '6-beds', name: '6 Beds', slug: '6-beds', category: 'bedrooms', icon: 'Bed' },

  // === PROPERTY FEATURES ===
  { id: 'pool-spa', name: 'Pool/Spa', slug: 'pool-spa', category: 'property_features', icon: 'Waves' },
  { id: 'basement', name: 'Basement', slug: 'basement', category: 'property_features', icon: 'ArrowDownSquare' },
  { id: 'furnished', name: 'Furnished', slug: 'furnished', category: 'property_features', icon: 'Sofa' },
  { id: 'huge-backyard', name: 'Huge Backyard', slug: 'huge-backyard', category: 'property_features', icon: 'TreePine' },
  { id: 'horse-property', name: 'Horse Property', slug: 'horse-property', category: 'property_features', icon: 'Heart' },
  { id: 'waterfront', name: 'Waterfront', slug: 'waterfront', category: 'property_features', icon: 'Anchor' },
  { id: 'golf-course', name: 'Golf Course', slug: 'golf-course', category: 'property_features', icon: 'Flag' },
  { id: 'large-lot', name: 'Large Lot', slug: 'large-lot', category: 'property_features', icon: 'Maximize' },
  { id: 'rv-parking', name: 'RV Parking', slug: 'rv-parking', category: 'property_features', icon: 'Truck' },

  // === RENTAL & LEASE ===
  { id: 'for-rent', name: 'For Rent', slug: 'for-rent', category: 'rental_lease', icon: 'Key' },
  { id: 'for-sale-or-lease', name: 'For Sale or Lease', slug: 'for-sale-lease', category: 'rental_lease', icon: 'GitBranch' },

  // === SPECIAL ===
  { id: 'se-habla-espanol', name: 'Se Habla Español', slug: 'se-habla-espanol', category: 'special', icon: 'Globe' },
  { id: 'owner-agent', name: 'Owner/Agent', slug: 'owner-agent', category: 'special', icon: 'UserCheck' },
  { id: 'home-warranty', name: 'Home Warranty', slug: 'home-warranty', category: 'special', icon: 'Shield' },
  { id: 'gorgeous-inside', name: "I'm Gorgeous Inside", slug: 'gorgeous-inside', category: 'special', icon: 'Gem' },
  { id: 'neighborhood-specialist', name: 'Neighborhood Specialist', slug: 'neighborhood-specialist', category: 'special', icon: 'MapPin' },
  { id: 'acreage', name: 'Acreage', slug: 'acreage', category: 'special', icon: 'TreePine' },

  // === CUSTOM (with input) ===
  {
    id: 'custom-acres',
    name: 'Custom Acres',
    slug: 'custom-acres',
    category: 'custom',
    icon: 'Mountain',
    requiresInput: true,
    inputLabel: 'Number of Acres',
    inputType: 'number',
    inputSuffix: 'Acres'
  },
  {
    id: 'custom-car-garage',
    name: 'Car Garage',
    slug: 'car-garage',
    category: 'custom',
    icon: 'Car',
    requiresInput: true,
    inputLabel: 'Number of Cars',
    inputType: 'number',
    inputSuffix: 'Car Garage'
  }
]

export const RIDER_PRICING = {
  rental: 5.00,
  install: 2.00
}

export const POPULAR_RIDER_IDS = ['pop-pending', 'pop-coming-soon', 'pop-for-sale', 'pop-sold']

export function getRidersByCategory(category: string): RiderOption[] {
  return RIDERS.filter(r => r.category === category)
}

export function getRiderBySlug(slug: string): RiderOption | undefined {
  return RIDERS.find(r => r.slug === slug)
}

export function getRiderById(id: string): RiderOption | undefined {
  return RIDERS.find(r => r.id === id)
}
