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
  { id: 'pop-sold', name: 'Sold', slug: 'sold', category: 'popular', icon: 'CheckCircle' },
  { id: 'pop-pending', name: 'Pending', slug: 'pending', category: 'popular', icon: 'Clock' },
  { id: 'pop-coming-soon', name: 'Coming Soon', slug: 'coming-soon', category: 'popular', icon: 'Calendar' },
  { id: 'pop-for-sale', name: 'For Sale', slug: 'for-sale', category: 'popular', icon: 'DollarSign' },

  // === STATUS ===
  { id: 'sold', name: 'Sold', slug: 'sold', category: 'status', icon: 'CheckCircle' },
  { id: 'pending', name: 'Pending', slug: 'pending', category: 'status', icon: 'Clock' },
  { id: 'coming-soon', name: 'Coming Soon', slug: 'coming-soon', category: 'status', icon: 'Calendar' },
  { id: 'for-sale', name: 'For Sale', slug: 'for-sale', category: 'status', icon: 'DollarSign' },
  { id: 'back-on-market', name: 'Back on the Market', slug: 'back-on-market', category: 'status', icon: 'RefreshCw' },
  { id: 'by-appointment', name: 'By Appointment Only', slug: 'by-appointment', category: 'status', icon: 'CalendarCheck' },

  // === BEDROOMS ===
  { id: '3-beds', name: '3 Beds', slug: '3-beds', category: 'bedrooms', icon: 'Bed' },
  { id: '4-beds', name: '4 Beds', slug: '4-beds', category: 'bedrooms', icon: 'Bed' },
  { id: '5-beds', name: '5 Beds', slug: '5-beds', category: 'bedrooms', icon: 'Bed' },
  { id: '6-beds', name: '6 Beds', slug: '6-beds', category: 'bedrooms', icon: 'Bed' },

  // === PROPERTY FEATURES ===
  { id: 'pool', name: 'Pool', slug: 'pool', category: 'property_features', icon: 'Waves' },
  { id: 'spa', name: 'Spa', slug: 'spa', category: 'property_features', icon: 'Sparkles' },
  { id: 'basement', name: 'Basement', slug: 'basement', category: 'property_features', icon: 'ArrowDownSquare' },
  { id: 'horse-property', name: 'Horse Property', slug: 'horse-property', category: 'property_features', icon: 'Heart' },
  { id: 'lake-front', name: 'Lake Front', slug: 'lake-front', category: 'property_features', icon: 'Anchor' },
  { id: 'large-lot', name: 'Large Lot', slug: 'large-lot', category: 'property_features', icon: 'Maximize' },
  { id: 'rv-parking', name: 'RV Parking', slug: 'rv-parking', category: 'property_features', icon: 'Truck' },
  { id: 'no-hoa', name: 'No HOA', slug: 'no-hoa', category: 'property_features', icon: 'ShieldOff' },

  // === RENTAL & LEASE ===
  { id: 'for-rent', name: 'For Rent', slug: 'for-rent', category: 'rental_lease', icon: 'Key' },
  { id: 'for-lease', name: 'For Lease', slug: 'for-lease', category: 'rental_lease', icon: 'FileText' },
  { id: 'for-sale-or-lease', name: 'For Sale or Lease', slug: 'for-sale-lease', category: 'rental_lease', icon: 'GitBranch' },

  // === SPECIAL ===
  { id: 'se-habla-espanol', name: 'Se Habla Español', slug: 'se-habla-espanol', category: 'special', icon: 'Globe' },
  { id: 'owner-agent', name: 'Owner/Agent', slug: 'owner-agent', category: 'special', icon: 'UserCheck' },
  { id: 'home-warranty', name: 'Home Warranty', slug: 'home-warranty', category: 'special', icon: 'Shield' },
  { id: 'gorgeous-inside', name: "I'm Gorgeous Inside", slug: 'gorgeous-inside', category: 'special', icon: 'Gem' },
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
  }
]

export const RIDER_PRICING = {
  rental: 5.00,
  install: 2.00
}

export const POPULAR_RIDER_IDS = ['pop-sold', 'pop-pending', 'pop-coming-soon', 'pop-for-sale']

export function getRidersByCategory(category: string): RiderOption[] {
  return RIDERS.filter(r => r.category === category)
}

export function getRiderBySlug(slug: string): RiderOption | undefined {
  return RIDERS.find(r => r.slug === slug)
}

export function getRiderById(id: string): RiderOption | undefined {
  return RIDERS.find(r => r.id === id)
}
