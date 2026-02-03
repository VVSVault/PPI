// Application Constants

export const APP_NAME = 'Pink Posts Installations'
export const APP_DESCRIPTION = "Central Kentucky's trusted yard sign installation service for real estate professionals."

// Contact Information
export const CONTACT = {
  phone: '(859) 555-0123',
  email: 'hello@pinkpost.com',
  address: 'Lexington, KY',
}

// Service Areas
export const SERVICE_AREAS = [
  'Fayette County',
  'Scott County',
  'Woodford County',
  'Jessamine County',
  'Clark County',
  'Madison County',
  'Bourbon County',
]

// Post Types
export const POST_TYPES = {
  WHITE: 'white',
  BLACK: 'black',
  PINK: 'pink',
} as const

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

// Installation Status
export const INSTALLATION_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  REMOVAL_SCHEDULED: 'removal_scheduled',
  REMOVED: 'removed',
} as const

// Invoice Status
export const INVOICE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const

// Pricing (in dollars)
export const PRICING = {
  posts: {
    white: {
      installation: 55,
      reinstall: 35,
      replacement: 75,
    },
    black: {
      installation: 55,
      reinstall: 35,
      replacement: 75,
    },
    pink: {
      installation: 65,
      reinstall: 40,
      replacement: 85,
    },
  },
  riders: {
    standard: 5,
    custom: 10,
  },
  lockboxes: {
    standard: {
      rental: 15,
      deposit: 50,
    },
    electronic: {
      rental: 25,
      deposit: 100,
    },
  },
}

// Navigation Links
export const NAV_LINKS = {
  marketing: [
    { href: '/posts', label: 'Posts' },
    { href: '/riders', label: 'Riders' },
    { href: '/faq', label: 'FAQ' },
  ],
  dashboard: {
    main: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/dashboard/post-options', label: 'Post Options' },
      { href: '/dashboard/rider-options', label: 'Rider Options' },
      { href: '/dashboard/lockbox-options', label: 'Lockbox Options' },
    ],
    orders: [
      { href: '/dashboard/place-order', label: 'Place Order' },
      { href: '/dashboard/order-history', label: 'Order History' },
      { href: '/dashboard/invoices', label: 'Invoices' },
    ],
    account: [
      { href: '/dashboard/profile', label: 'Profile' },
    ],
  },
}
