# Pink Post Installations - Production Documentation

## Overview

Pink Post Installations is a premium yard sign installation service platform for real estate professionals in Kentucky and surrounding areas. This documentation covers the production build implementation.

**Repository:** https://github.com/VVSVault/PPI

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Database | Railway PostgreSQL + Prisma ORM |
| Authentication | NextAuth.js (Credentials Provider) |
| Payments | Stripe (Elements, Payment Intents) |
| Email | Resend |
| Hosting | Vercel (recommended) |

---

## Project Structure

```
pink-post-installations/
├── app/
│   ├── (marketing)/          # Public landing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── faq/page.tsx      # FAQ page
│   │   └── layout.tsx
│   │
│   ├── (auth)/               # Authentication pages
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── layout.tsx
│   │
│   ├── dashboard/            # Customer dashboard
│   │   ├── page.tsx          # Overview
│   │   ├── post-options/     # Post types info
│   │   ├── rider-options/    # Rider types info
│   │   ├── lockbox-options/  # Lockbox types info
│   │   ├── place-order/      # Order wizard
│   │   ├── order-history/    # Past orders
│   │   ├── billing/          # Payment history
│   │   ├── profile/          # User profile
│   │   └── layout.tsx
│   │
│   ├── admin/                # Admin dashboard
│   │   ├── page.tsx          # Admin overview
│   │   ├── customers/        # Customer management
│   │   ├── orders/           # Order management
│   │   ├── settings/         # Business settings
│   │   └── layout.tsx
│   │
│   └── api/                  # API routes
│       ├── orders/           # Order CRUD
│       ├── inventory/        # Customer inventory
│       ├── installations/    # Active installations
│       ├── payments/         # Stripe integration
│       ├── admin/            # Admin endpoints
│       └── webhooks/         # Stripe webhooks
│
├── components/
│   ├── ui/                   # Base UI components
│   ├── marketing/            # Landing page components
│   ├── dashboard/            # Dashboard components
│   ├── order-flow/           # Order wizard steps
│   └── shared/               # Shared components
│
├── lib/
│   ├── prisma.ts             # Prisma client config
│   ├── auth.ts               # NextAuth configuration
│   ├── auth-utils.ts         # Auth helper functions
│   ├── stripe/               # Stripe client/server
│   ├── email.ts              # Email templates
│   ├── validations.ts        # Zod schemas
│   └── utils.ts              # Utilities
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seed data script
│   └── migrations/           # Database migrations
│
├── types/
│   ├── database.ts           # TypeScript types
│   └── next-auth.d.ts        # NextAuth type extensions
│
└── public/
    └── images/posts/         # Post images
```

---

## Features

### 1. Landing Page

**Route:** `/`

- Hero section with tagline: "We take care of the dirty work, so you can focus on closing more deals!"
- Post showcase (White, Black, Pink vinyl posts)
- Value propositions (6 key benefits)
- Trip services callout
- FAQ section
- CTA banner

### 2. Customer Dashboard

**Route:** `/dashboard`

| Page | Description |
|------|-------------|
| Overview | Stats cards, active installations table |
| Post Options | View available post types and pricing |
| Rider Options | View rider catalog and pricing |
| Lockbox Options | View lockbox types and pricing |
| Place Order | 9-step order wizard |
| Order History | View past orders with status |
| Billing | Payment history with itemized receipts |
| Profile | Account settings |

### 3. Order Wizard

**Route:** `/dashboard/place-order`

The order wizard guides customers through 9 steps:

1. **Property Information** - Address, property type, installation notes
2. **Post Selection** - White ($55), Black ($55), or Pink ($65)
3. **Sign Selection** - Use stored sign, sign at property, or no sign
4. **Rider Selection** - Rent riders ($5) or install own ($2)
5. **Lockbox Selection** - SentriLock, mechanical (own or rental)
6. **Brochure Box** - Use stored, buy new, or skip
7. **Scheduling** - Next available, specific date, or expedited
8. **Review & Pay** - Order summary with Stripe payment

### 4. Admin Dashboard

**Route:** `/admin`

| Page | Description |
|------|-------------|
| Overview | Business metrics (customers, orders, revenue) |
| Customers | Customer list with inventory counts |
| Customer Detail | View/edit customer inventory (signs, riders, lockboxes) |
| Orders | All orders with status management |
| Settings | Business configuration info |

**Access:** Only users with `role = 'admin'` in the profiles table can access.

---

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts with Stripe customer ID |
| `post_types` | Post catalog (White, Black, Pink) |
| `rider_catalog` | Rider types (26 options) |
| `lockbox_types` | Lockbox options |

### Customer Inventory

| Table | Purpose |
|-------|---------|
| `customer_signs` | Signs stored for customer |
| `customer_riders` | Riders owned by customer |
| `customer_lockboxes` | Lockboxes owned by customer |
| `customer_brochure_boxes` | Brochure boxes in storage |

### Orders & Installations

| Table | Purpose |
|-------|---------|
| `orders` | Order records with payment status |
| `order_items` | Line items for each order |
| `installations` | Active sign installations |
| `installation_riders` | Riders on active installations |
| `installation_lockboxes` | Lockboxes on active installations |

### Payments

| Table | Purpose |
|-------|---------|
| `payment_methods` | Saved Stripe payment methods |

---

## API Endpoints

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List user's orders |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/[id]` | Get order details |
| PUT | `/api/orders/[id]` | Update order (admin) |
| DELETE | `/api/orders/[id]` | Cancel order |

### Inventory

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get user's full inventory |
| GET | `/api/inventory/signs` | Get user's signs |
| POST | `/api/inventory/signs` | Add new sign |

### Installations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/installations` | List user's installations |
| POST | `/api/installations/[id]/schedule-removal` | Schedule removal |
| POST | `/api/installations/[id]/add-rider` | Add rider to installation |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments/methods` | List saved cards |
| POST | `/api/payments/methods` | Save new card |
| PUT | `/api/payments/methods/[id]` | Set as default |
| DELETE | `/api/payments/methods/[id]` | Remove card |
| POST | `/api/payments/setup-intent` | Create setup intent |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/customers` | List all customers |
| GET | `/api/admin/customers/[id]` | Customer detail |
| PUT | `/api/admin/customers/[id]` | Update customer |
| POST | `/api/admin/customers/[id]/inventory` | Add inventory item |
| DELETE | `/api/admin/customers/[id]/inventory` | Delete inventory item |
| GET | `/api/admin/orders` | List all orders |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/stripe` | Stripe webhook handler |

---

## Pricing Structure

| Item | Price |
|------|-------|
| **Posts** | |
| White Vinyl Post (install & pickup) | $55 |
| Black Vinyl Post (install & pickup) | $55 |
| Signature Pink Post (install & pickup) | $65 |
| Reinstallation (weather/natural) | FREE |
| **Signs** | |
| Install customer's sign | $3 |
| **Riders** | |
| Install customer's rider | $2 |
| Rent a rider | $5 |
| **Lockboxes** | |
| Install SentriLock (customer's) | $5 |
| Install Mechanical (customer's) | $5 |
| Rent Mechanical | $15 |
| **Brochure Box** | |
| New brochure box | $23 |
| Install from storage | $2 |
| **Fees** | |
| Fuel Surcharge (all orders) | $2.47 |
| Expedite Fee (same day) | $25 |

---

## Environment Variables

Create a `.env.local` file with these variables:

```env
# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Email)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=https://pinkpostinstallations.com

# Admin notifications
ADMIN_EMAIL=contact@pinkposts.com
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/VVSVault/PPI.git
cd PPI
npm install
```

### 2. Set Up Railway PostgreSQL

1. Create a Railway account and new project
2. Add a PostgreSQL database
3. Copy the connection URL to your `.env.local` as `DATABASE_URL`

### 3. Set Up Database

```bash
# Run migrations
npx prisma migrate dev

# Seed initial data
npm run db:seed
```

### 4. Set Up Stripe

1. Create a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Set up a webhook endpoint pointing to `/api/webhooks/stripe`
4. Add keys to `.env.local`

### 5. Set Up Resend

1. Create a Resend account
2. Get your API key
3. Add to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

### 7. Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

---

## Making a User an Admin

To grant admin access:

1. Use Prisma Studio: `npm run db:studio`
2. Or run directly via SQL:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'user@example.com';
```

**Note:** The seed script creates an admin user: `admin@pinkposts.com` with password `admin123`

---

## Email Notifications

### Customer Emails
- **Order Confirmation** - Sent when order is placed and payment succeeds

### Admin Emails
- **New Order Alert** - Sent immediately when a new order is received
- Includes customer info, property address, and order details

---

## Security

- **Authentication:** NextAuth.js with JWT sessions
- **Password Hashing:** bcrypt with 12 rounds
- **Admin Check:** API routes verify admin role
- **Payments:** Stripe handles all card data (PCI compliant)
- **Input Validation:** Zod schemas on all forms
- **HTTPS:** Enforced via Vercel

---

## File Highlights

### Key Components

| File | Description |
|------|-------------|
| `components/order-flow/order-wizard.tsx` | Main order wizard with step navigation |
| `components/order-flow/steps/*.tsx` | Individual step components |
| `components/marketing/hero.tsx` | Landing page hero section |
| `components/marketing/post-showcase.tsx` | Post display section |
| `components/dashboard/sidebar.tsx` | Dashboard navigation |
| `app/admin/layout.tsx` | Admin layout with auth check |

### Key Libraries

| File | Description |
|------|-------------|
| `lib/prisma.ts` | Prisma client with pg adapter |
| `lib/auth.ts` | NextAuth configuration |
| `lib/auth-utils.ts` | Auth helper functions |
| `lib/stripe/server.ts` | Stripe server-side utilities |
| `lib/stripe/client.ts` | Stripe client-side loader |
| `lib/email.ts` | Email templates and sending |
| `lib/validations.ts` | Zod validation schemas |

---

## Changelog

### v2.1.0 (Railway Migration)

- Migrated from Supabase to Railway PostgreSQL
- Replaced Supabase Auth with NextAuth.js
- Added Prisma ORM for database access
- Added pg adapter for Prisma 7 compatibility
- Created database seed script
- Updated all API routes to use Prisma
- Added bcrypt password hashing

### v2.0.0 (Production Build)

- Added multi-step order wizard (9 steps)
- Added admin dashboard with customer/inventory management
- Added Stripe payment integration
- Added email notifications via Resend
- Added billing history page
- Updated landing page with production messaging
- Complete database schema
- Full TypeScript types for all tables

### v1.0.0 (Initial Build)

- Basic Next.js setup with Tailwind CSS
- Marketing pages
- Dashboard layout
- UI component library
- Supabase integration (auth)

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/VVSVault/PPI/issues
- Developer: Tanner Carlson / VVS Vault LLC
